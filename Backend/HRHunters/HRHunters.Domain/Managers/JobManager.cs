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
using System.IO;
using HRHunters.Common.Constants;
using Microsoft.EntityFrameworkCore;

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
                _logger.LogError(ErrorConstants.UnauthorizedAccess);
                throw new UnauthorizedAccessException(ErrorConstants.UnauthorizedAccess);
            }
            var current = await _userManager.FindByIdAsync(currentUserId.ToString());
            IList<string> role = await _userManager.GetRolesAsync(current);
            var query = _repo.GetAll<JobPosting>(includeProperties: $"{nameof(Client)}.{nameof(Client.User)}," + $"{nameof(JobPosting.Applications)}");
            var applied = _repo.GetAll<Application>().Where(x => x.ApplicantId == request.Id).Select(x => x.JobPostingId).ToList();

            if (!role.Contains(RoleConstants.ADMIN))
            {
                if (role.Contains(RoleConstants.APPLICANT))
                {
                    query = query.Where(x => x.Client.Status == ClientStatus.Active && x.Status == JobPostingStatus.Approved).Where(x => !applied.Contains(x.Id));
                }

                if (role.Contains(RoleConstants.CLIENT))
                {
                    query = query.Where(x => x.ClientId == request.Id);
                }
            }

            var response = new JobResponse() { JobPostings = new List<JobInfo>() };

            var selected = _mapper.ProjectTo<JobInfo>(query).Applyfilters(request);
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
            var response = new GeneralResponse();

            if (jobSubmit.Id != currentUserId && !userRole.Contains(RoleConstants.ADMIN))
            {
                _logger.LogError(ErrorConstants.UnauthorizedAccess);
                response.Errors["Error"].Add(ErrorConstants.UnauthorizedAccess);
                return response;
            }
            var company = new Client();
            company = _repo.GetById<Client>(jobSubmit.Id);

            var jobPost = new JobPosting()
            {
                Client = company,
            };

            jobPost = _mapper.Map(jobSubmit, jobPost);
            bool dateFromParse = DateTime.TryParse(jobSubmit.DateFrom, out DateTime dateFrom);
            bool dateToParse = DateTime.TryParse(jobSubmit.DateTo, out DateTime dateTo);
            bool educationParse = Enum.TryParse(jobSubmit.Education, out EducationType education);
            bool empCategoryParse = Enum.TryParse(jobSubmit.EmpCategory, out JobType empCategory);

            if(!dateFromParse || !dateToParse || !educationParse || !empCategoryParse)
            {
                _logger.LogError(ErrorConstants.InvalidInput, dateFrom, dateTo, education, empCategory);
                response.Errors["Error"].Add(ErrorConstants.InvalidInput);

                return response;
            }
            
            jobPost.DateFrom = dateFrom;
            jobPost.DateTo = dateTo;
            jobPost.EmpCategory = empCategory;
            jobPost.Education = education;
            if (userRole.Contains(RoleConstants.CLIENT))
            {
                jobPost.Status = JobPostingStatus.Pending;
                try
                {
                    _repo.Create(jobPost, company.User.FirstName);
                    response.Succeeded = true;
                }catch(DbUpdateException e)
                {
                    _logger.LogError(e.Message, jobPost);
                    response.Errors["Error"].Add(e.Message);
                }
                
            }
            else
            {
                jobPost.Status = JobPostingStatus.Approved;
                try
                {
                    _repo.Create(jobPost, RoleConstants.ADMIN);
                    response.Succeeded = true;
                }catch(DbUpdateException e)
                {
                    _logger.LogError(e.Message, jobPost);
                    response.Errors["Error"].Add(e.Message);
                }
                
            }
            return response;
        }

        public JobInfo GetOneJobPosting(int id)
        {

            var jobPost = _repo.GetOne<JobPosting>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");

            return _mapper.Map<JobInfo>(jobPost);

        }

        public async Task<GeneralResponse> UpdateJob(JobUpdate jobUpdate, int currentUserId)
        {
            var userRole = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(currentUserId.ToString()));
            var response = new GeneralResponse();
            if (!userRole.Contains(RoleConstants.ADMIN))
            {
                _logger.LogError(ErrorConstants.UnauthorizedAccess);
                response.Errors["Error"].Add(ErrorConstants.UnauthorizedAccess);
                return response;
            }
            
            var jobPost = _repo.GetOne<JobPosting>(filter: x => x.Id == jobUpdate.Id,
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");

            if(jobPost == null)
            {
                response.Errors["Error"].Add(ErrorConstants.InvalidInput);
                return response;
            }
            if (!string.IsNullOrEmpty(jobUpdate.Status))
            {
                bool statusParse = Enum.TryParse(jobUpdate.Status, out JobPostingStatus statusToUpdate);
                if (!statusParse)
                {
                    _logger.LogError(ErrorConstants.InvalidInput, jobUpdate.Status);
                    response.Errors["Error"].Add(ErrorConstants.InvalidInput);
                    return response;
                }
                jobPost.Status = statusToUpdate;
            }
            else
            if (jobUpdate != null)
            {
                jobPost = _mapper.Map(jobUpdate, jobPost);
                bool jobTypeParse = Enum.TryParse(jobUpdate.JobType, out JobType currentJobType);
                bool educationParse = Enum.TryParse(jobUpdate.Education, out EducationType currentEducation);
                bool dateFromParse = DateTime.TryParse(jobUpdate.DateFrom, out DateTime dateFrom);
                bool dateToParse = DateTime.TryParse(jobUpdate.DateTo, out DateTime dateTo);
                if(!jobTypeParse || !educationParse || !dateToParse || !dateToParse)
                {
                    _logger.LogError(ErrorConstants.InvalidInput, dateFrom, dateTo, currentEducation, currentJobType);
                    response.Errors["Error"].Add(ErrorConstants.InvalidInput);
                    return response;
                }
                jobPost.DateTo = dateTo;
                jobPost.DateFrom = dateFrom;
                jobPost.EmpCategory = currentJobType;
                jobPost.Education = currentEducation;
            }
            else
            {
                response.Errors["Error"].Add(ErrorConstants.NullValue);
                return response;
            }

            try
            {
                _repo.Update(jobPost, RoleConstants.ADMIN);
                response.Succeeded = true;
            }
            catch(DbUpdateException e)
            {
                _logger.LogError(e.Message, jobPost);
                response.Errors["Error"].Add(e.Message);
            }
            
            return response;
        }

        //public GeneralResponse CreateMultipleJobPostings(IFormFile formFile, int id)
        //{
           
        //    var errors = new Dictionary<string, List<string>>();



           
        //    return null;
        //}
    }
}

