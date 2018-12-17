using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Enums;
using HRHunters.Common.ExtensionMethods;
using System.Globalization;
using HRHunters.Common.Requests.Admin;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Dynamic;
using HRHunters.Common.Responses;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using HRHunters.Common.Exceptions;
using HRHunters.Common.Requests;
using Microsoft.Extensions.Logging;

namespace HRHunters.Domain.Managers
{
    public class JobManager : BaseManager, IJobManager
    {
        private readonly IRepository _repo;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<JobManager> _logger;
        public JobManager(IRepository repo, UserManager<User> userManager, IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogger<JobManager> logger) : base(repo)
        {
            _repo = repo;
            _userManager = userManager;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<JobResponse> GetMultiple(SearchRequest request, int currentUserId)
        {
            if (request.Id != currentUserId)
            {
                _logger.LogCritical("Unauthorized user tried to access this method!.");
                throw new UnauthorizedAccessException();
            }
            var current = await _userManager.FindByIdAsync(currentUserId.ToString());
            IList<string> role = _userManager.GetRolesAsync(current).Result;
            var query = _repo.GetAll<JobPosting>(includeProperties: $"{nameof(Client)}.{nameof(Client.User)}," + $"{nameof(JobPosting.Applications)}");
            var applied = _repo.GetAll<Application>().Where(x => x.ApplicantId == request.Id).Select(x => x.JobPostingId).ToList();
            if (!role.Contains("Admin"))
            {
                if (role.Contains("Applicant"))
                {
                    query = query.Where(x => x.Client.Status == ClientStatus.Active && x.Status == JobPostingStatus.Approved).Where(x => !applied.Contains(x.Id));
                }

                if (role.Contains("Client"))
                {
                    query = query.Where(x => x.ClientId == request.Id);
                }
            }

            var response = new JobResponse() { JobPostings = new List<JobInfo>() };

            var selected = _mapper.ProjectTo<JobInfo>(query).Applyfilters(request.PageSize, request.CurrentPage, request.SortedBy, request.SortDir, request.FilterBy, request.FilterQuery);
            response.JobPostings.AddRange(selected.ToList());
            var groupings = _repo.GetAll<JobPosting>().GroupBy(x => x.Status).Select(x => new { Status = x.Key, Count = x.Count() }).ToList();

            response.MaxJobPosts = groupings.Sum(x => x.Count);
            response.Approved = groupings.Where(x => x.Status.Equals(JobPostingStatus.Approved)).Select(x => x.Count).FirstOrDefault();
            response.Pending = groupings.Where(x => x.Status.Equals(JobPostingStatus.Pending)).Select(x => x.Count).FirstOrDefault();
            response.Rejected = groupings.Where(x => x.Status.Equals(JobPostingStatus.Rejected)).Select(x => x.Count).FirstOrDefault();
            response.Expired = groupings.Where(x => x.Status.Equals(JobPostingStatus.Expired)).Select(x => x.Count).FirstOrDefault();

            return response;
        }

        public async Task<GeneralResponse> CreateJobPosting(JobSubmit jobSubmit, int currentUserId)
        {
            var userRole = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(currentUserId.ToString()));

            if (jobSubmit.Id != currentUserId && !userRole.Contains("Admin"))
            {
                throw new UnauthorizedAccessException();
            }
            var company = new Client();
            var list = new List<string>();
            var response = new GeneralResponse()
            {
                Succeeded = true,
                Errors = new Dictionary<string, List<string>>()
            };

            company = _repo.GetById<Client>(jobSubmit.Id);
            var jobPost = new JobPosting()
            {
                Client = company,
            };
            jobPost = _mapper.Map(jobSubmit, jobPost);
            DateTime.TryParse(jobSubmit.DateFrom, out DateTime dateFrom);
            DateTime.TryParse(jobSubmit.DateTo, out DateTime dateTo);
            Enum.TryParse(jobSubmit.Education, out EducationType education);
            Enum.TryParse(jobSubmit.EmpCategory, out JobType empCategory);

            jobPost.DateFrom = dateFrom;
            jobPost.DateTo = dateTo;
            jobPost.EmpCategory = empCategory;
            jobPost.Education = education;
            if (userRole.Contains("Client"))
            {
                jobPost.Status = JobPostingStatus.Pending;
                _repo.Create(jobPost, company.User.FirstName);
            }
            else
            {
                jobPost.Status = JobPostingStatus.Approved;
                _repo.Create(jobPost, "Admin");                
            }


            return response;
        }

        public JobInfo GetOneJobPosting(int id)
        {

            var jobPost = _repo.GetOne<JobPosting>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");

            return _mapper.Map(jobPost, new JobInfo());

        }

        public async Task<GeneralResponse> UpdateJob(JobUpdate jobUpdate, int currentUserId)
        {
            var userRole = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(currentUserId.ToString()));

            if (!userRole.Contains("Admin"))
            {
                throw new UnauthorizedAccessException();
            }
            var response = new GeneralResponse()
            {
                Succeeded = true,
                Errors = new Dictionary<string, List<string>>(),
            };
            var jobPost = _repo.GetOne<JobPosting>(filter: x => x.Id == jobUpdate.Id,
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");

            if (!string.IsNullOrEmpty(jobUpdate.Status) && jobPost != null)
            {

                Enum.TryParse(jobUpdate.Status, out JobPostingStatus statusToUpdate);
                jobPost.Status = statusToUpdate;
            }
            else
            if (jobPost != null && jobUpdate != null)
            {
                jobPost = _mapper.Map(jobUpdate, jobPost);
                Enum.TryParse(jobUpdate.JobType, out JobType currentJobType);
                jobPost.EmpCategory = currentJobType;
                Enum.TryParse(jobUpdate.Education, out EducationType currentEducation);
                jobPost.Education = currentEducation;
                DateTime.TryParse(jobUpdate.DateFrom, out DateTime date);
                jobPost.DateFrom = date;
                DateTime.TryParse(jobUpdate.DateTo, out date);
                jobPost.DateTo = date;
            }
            else
            {
                response.Errors.Add("Error", new List<string> { "Front-end sends wrong information!" });
                response.Succeeded = false;
                return response;
            }
            _repo.Update(jobPost, "Admin");

            return response;
        }
    }
}
