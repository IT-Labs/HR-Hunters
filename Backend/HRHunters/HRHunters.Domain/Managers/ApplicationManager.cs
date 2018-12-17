using AutoMapper;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Exceptions;
using HRHunters.Common.ExtensionMethods;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
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
        public ApplicationManager(IRepository repo, IMapper mapper) : base(repo)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public ApplicationResponse GetMultiple(SearchRequest request, int currentUserId)
        {
            //If the request is sent by an applicant user, check if the current logged user is the same as the ID sent 
            if (request.Id != 0 && request.Id != currentUserId)
                throw new UnauthorizedAccessException("Unauthorized user accessed.");

            var response = new ApplicationResponse() { Applications = new List<ApplicationInfo>() };
            var query = _repo.Get<Application>(filter: x => request.Id != 0 ? x.ApplicantId == request.Id : true,
               includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)}," +
                                  $"{nameof(JobPosting)}");
            var selected = _mapper.ProjectTo<ApplicationInfo>(query);

            selected = selected.Applyfilters(request.PageSize, request.CurrentPage, request.SortedBy, request.SortDir, request.FilterBy, request.FilterQuery);

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
            var application = _repo.Get<Application>(filter: x => x.Id == applicationStatusUpdate.Id,
                                                    includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)}," +
                                                                       $"{nameof(JobPosting)}").FirstOrDefault();

            Enum.TryParse(applicationStatusUpdate.Status, out ApplicationStatus statusToUpdate);
            application.Status = statusToUpdate;
            _repo.Update(application, "Admin");
            return _mapper.Map(application, new ApplicationInfo());
        }
        public GeneralResponse CreateApplication(Apply apply)
        {
            var active = _repo.Get<JobPosting>(filter: x => x.Id == apply.JobId,
                                              includeProperties: $"{nameof(JobPosting.Client)}").FirstOrDefault();
            var company = _repo.Get<Client>(filter: x => x.Id == active.Client.Id).FirstOrDefault();
            var applicant = _repo.Get<Applicant>(filter: x => x.Id == apply.ApplicantId, includeProperties: $"{nameof(User)}").FirstOrDefault();
            var list = new List<string>();
            var applied = _repo.GetAll<Application>().Where(x => x.ApplicantId == apply.ApplicantId).ToList();

            var response = new GeneralResponse()
            {
                Succeeded = false,
                Errors = new Dictionary<string, List<string>>()
            };
            if (active == null || company.Status==ClientStatus.Inactive || active.Status != JobPostingStatus.Approved || applied.Where(x => x.JobPostingId == active.Id).Any())
            {
                response.Errors.Add("Error", new List<string> { "Invalid input" });
                response.Succeeded = false;
            }
            else 
            {                                               
                var application = new Application()
                {
                    ApplicantId = apply.ApplicantId,
                    Date = DateTime.UtcNow,
                    JobPostingId = apply.JobId,
                    Status = ApplicationStatus.Pending
                };
                _repo.Create(application, applicant.User.FirstName);
                response.Succeeded = true;
            }
            return response;

        }
    }
}