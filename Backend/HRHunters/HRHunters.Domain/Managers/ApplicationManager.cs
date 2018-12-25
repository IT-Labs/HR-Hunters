using AutoMapper;
using HRHunters.Common.Constants;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Exceptions;
using HRHunters.Common.ExtensionMethods;
using HRHunters.Common.HelperMethods;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Domain.Managers
{

    public class ApplicationManager : BaseManager, IApplicationManager
    {
        private readonly IRepository _repo;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<ApplicationManager> _logger;
        private readonly IEmailSenderManager _emailSender;
        public ApplicationManager(IRepository repo, IMapper mapper, UserManager<User> userManager, ILogger<ApplicationManager> logger, IEmailSenderManager emailSender) : base(repo)
        {
            _emailSender = emailSender;
            _repo = repo;
            _mapper = mapper;
            _userManager = userManager;
            _logger = logger;
        }

        public ApplicationInfo GetOneApplication(int id, int currentUserId)
        {
            var application = _repo.GetOne<Application>(x => x.Id == id, includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)}," +
                                                                                            $"{nameof(JobPosting)}");
            if (application.ApplicantId != currentUserId) {
                _logger.LogError(ErrorConstants.UnauthorizedAccess, application.ApplicantId, currentUserId);
                throw new UnauthorizedAccessException(ErrorConstants.UnauthorizedAccess);
            }
            return _mapper.Map<ApplicationInfo>(application);
        }

        public async Task<ApplicationResponse> GetMultiple(SearchRequest request, int currentUserId)
        {
            if (request.Id != currentUserId)
            {
                _logger.LogError(ErrorConstants.UnauthorizedAccess, request.Id, currentUserId);
                throw new UnauthorizedAccessException(ErrorConstants.UnauthorizedAccess);
            }
            var current = await _userManager.FindByIdAsync(currentUserId.ToString());
            IList<string> role = _userManager.GetRolesAsync(current).Result;
            var query = _repo.GetAll<Application>(includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)}," +
                                                                     $"{nameof(JobPosting)}");
            if (!role.Contains(RoleConstants.ADMIN))
            {                
                if (role.Contains(RoleConstants.APPLICANT))
                {
                    query = query.Where(x=>x.ApplicantId == request.Id);
                }
            }

            var response = new ApplicationResponse() { Applications = new List<ApplicationInfo>() };          
            var selected = _mapper.ProjectTo<ApplicationInfo>(query);
            selected = selected.Applyfilters(request);

            response.Applications.AddRange(selected.ToList());
            var groupings = _repo.GetAll<Application>().GroupBy(x => x.Status).Select(x => new { Status = x.Key, Count = x.Count() }).ToList();
            
            response.MaxApplications = groupings.Sum(x => x.Count);
            response.Contacted = groupings.Where(x => x.Status.Equals(ApplicationStatus.Contacted)).Select(x => x.Count).FirstOrDefault();
            response.Pending = groupings.Where(x => x.Status.Equals(ApplicationStatus.Pending)).Select(x => x.Count).FirstOrDefault();
            response.Hired = groupings.Where(x => x.Status.Equals(ApplicationStatus.Hired)).Select(x => x.Count).FirstOrDefault();
            response.Interviewed = groupings.Where(x => x.Status.Equals(ApplicationStatus.Interviewed)).Select(x => x.Count).FirstOrDefault();
            response.Rejected = groupings.Where(x => x.Status.Equals(ApplicationStatus.Rejected)).Select(x => x.Count).FirstOrDefault();

            return response;

        }

        public ApplicationInfo UpdateApplicationStatus(ApplicationStatusUpdate applicationStatusUpdate)
        {
            var application = _repo.GetOne<Application>(filter: x => x.Id == applicationStatusUpdate.Id,
                                                    includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)}," +
                                                                       $"{nameof(JobPosting)}");

            bool success = Enum.TryParse(applicationStatusUpdate.Status, out ApplicationStatus statusToUpdate);
            if (!success) {
                _logger.LogError(ErrorConstants.InvalidInput, applicationStatusUpdate.Status);
                throw new ArgumentException(ErrorConstants.InvalidInput,applicationStatusUpdate.Status);
            }
            else
            {
                application.Status = statusToUpdate;
                try
                {
                    _repo.Update(application, RoleConstants.ADMIN);
                    return _mapper.Map<ApplicationInfo>(application);
                }catch(Exception e)
                {
                    _logger.LogError(e.Message, application);
                    throw;
                }
                
            }
        }
        public async Task<GeneralResponse> CreateApplication(Apply apply,int currentUserId)
        {
            var response = new GeneralResponse();

            if (currentUserId != apply.ApplicantId)
            {
                return response.ErrorHandling(ErrorConstants.UnauthorizedAccess, _logger, apply.ApplicantId, currentUserId);
            }

            var jobPost = _repo.GetOne<JobPosting>(filter: x => x.Id == apply.JobId,
                                              includeProperties: $"{nameof(JobPosting.Client)},{nameof(JobPosting.Applications)}");

            var applicant = _repo.GetOne<Applicant>(filter: x => x.Id == apply.ApplicantId, includeProperties: $"{nameof(User)},{nameof(Applicant.Applications)}");
            bool applied = jobPost.Applications.Any(x => x.ApplicantId == apply.ApplicantId);

            
            if (jobPost == null || jobPost.Client.Status==ClientStatus.Inactive || jobPost.Status != JobPostingStatus.Approved || applied)
            {
                return response.ErrorHandling<ApplicationManager>(ErrorConstants.InvalidInput);
            }
            else 
            {                                               
                var application = new Application()
                {
                    Applicant = applicant,
                    Date = DateTime.UtcNow,
                    JobPosting = jobPost,
                    Status = ApplicationStatus.Pending
                };
                try
                {
                    _repo.Create(application, applicant.User.FirstName);
                    response.Succeeded = true;
                    await _emailSender.SendEmail(applicant, jobPost);
                    return response;
                }
                catch(Exception e)
                {
                    return response.ErrorHandling(e.Message, _logger, application);
                } 
            }
        }
    }
}