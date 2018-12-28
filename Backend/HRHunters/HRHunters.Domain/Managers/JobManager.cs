using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using CsvHelper.TypeConversion;
using CsvHelper.Configuration.Attributes;
using CsvHelper;
using CsvHelper.Expressions;
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
using HRHunters.Common.HelperMethods;

namespace HRHunters.Domain.Managers
{
    public class JobManager : BaseManager, IJobManager
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<JobManager> _logger;
        public JobManager(IRepository repo, UserManager<User> userManager, IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogger<JobManager> logger) : base(repo)
        {
            _userManager = userManager;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<JobResponse> GetMultiple(SearchRequest request)
        {
            var current = await _userManager.FindByIdAsync(request.Id.ToString());
            IList<string> role = await _userManager.GetRolesAsync(current);
            var query = GetAll<JobPosting>($"{nameof(Client)}.{nameof(Client.User)}," + $"{nameof(JobPosting.Applications)}");
            var applied = Get<Application>(filter: x => x.ApplicantId.Equals(request.Id)).Select(x => x.JobPostingId).ToList();

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
            var groupings = GetAll<JobPosting>().GroupBy(x => x.Status).Select(x => new { Status = x.Key, Count = x.Count() }).ToList();

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
                return response.ErrorHandling(ErrorConstants.UnauthorizedAccess, _logger, jobSubmit.Id, currentUserId);
            }
            var company = new Client();
            company = GetById<Client>(jobSubmit.Id);
            
            var jobPost = new JobPosting()
            {
                Client = company,
            };

            jobPost = _mapper.Map(jobSubmit, jobPost);
            bool dateFromParse = DateTime.TryParse(jobSubmit.DateFrom, out DateTime dateFrom);
            bool dateToParse = DateTime.TryParse(jobSubmit.DateTo, out DateTime dateTo);
            bool educationParse = Enum.TryParse(jobSubmit.Education, out EducationType education);
            bool empCategoryParse = Enum.TryParse(jobSubmit.EmpCategory, out JobType empCategory);

            if (!dateFromParse || !dateToParse || !educationParse || !empCategoryParse || dateFrom > dateTo)
            {
                return response.ErrorHandling(ErrorConstants.InvalidInput, _logger, dateFrom, dateTo, education, empCategory);
            }
            
            jobPost.DateFrom = dateFrom;
            jobPost.DateTo = dateTo;
            jobPost.EmpCategory = empCategory;
            jobPost.Education = education;
            if (userRole.Contains(RoleConstants.CLIENT))
            {
                jobPost.Status = JobPostingStatus.Pending;
                Create(jobPost, company.User.FirstName);
            }else
            {
                jobPost.Status = JobPostingStatus.Approved;
                Create(jobPost, RoleConstants.ADMIN);
            }
            
            response.Succeeded = true;
            return response;
        }

        public JobInfo GetOneJobPosting(int id)
        {
            var jobPost = GetOne<JobPosting>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");

            return _mapper.Map<JobInfo>(jobPost);
        }

        public GeneralResponse UpdateJob(JobUpdate jobUpdate, int id)
        {
            var response = new GeneralResponse();

            var jobPost = GetOne<JobPosting>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");

            if (jobPost == null)
            {
                return response.ErrorHandling<JobManager>(ErrorConstants.NullValue, objects: jobPost);
            }
            if (!string.IsNullOrEmpty(jobUpdate.Status))
            {
                bool statusParse = Enum.TryParse(jobUpdate.Status, out JobPostingStatus statusToUpdate);
                if (!statusParse)
                {
                    return response.ErrorHandling(ErrorConstants.InvalidInput, _logger, jobUpdate.Status);
                }
                jobPost.Status = statusToUpdate;
            }
            else
            { 
                jobPost = _mapper.Map(jobUpdate, jobPost);
                bool jobTypeParse = Enum.TryParse(jobUpdate.JobType, out JobType currentJobType);
                bool educationParse = Enum.TryParse(jobUpdate.Education, out EducationType currentEducation);
                bool dateFromParse = DateTime.TryParse(jobUpdate.DateFrom, out DateTime dateFrom);
                bool dateToParse = DateTime.TryParse(jobUpdate.DateTo, out DateTime dateTo);
                if (!jobTypeParse || !educationParse || !dateToParse || !dateToParse || dateFrom > dateTo)
                {
                    return response.ErrorHandling(ErrorConstants.InvalidInput, _logger, dateFrom, dateTo, currentEducation, currentJobType);
                }

                jobPost.DateTo = dateTo;
                jobPost.DateFrom = dateFrom;
                jobPost.EmpCategory = currentJobType;
                jobPost.Education = currentEducation;
            }
        
            Update(jobPost, RoleConstants.ADMIN);
            response.Succeeded = true;
            return response;
        }

        public GeneralResponse UploadCSV(FileUpload fileUpload)
        {
            var response = new GeneralResponse();
            var result = HelperMethods.ValidateCSV(fileUpload.FormFile);
            if (!result.Response.Errors["Error"].Any())
            {
                var company = GetById<Client>(fileUpload.Id);
                if (company == null)
                {
                    response.ErrorHandling(ErrorConstants.InvalidInput,_logger,company);
                    return response;
                }
                foreach (var job in result.Jobs)
                {
                    var jobPost = new JobPosting();

                    jobPost = _mapper.Map(job, jobPost);
                    jobPost.Client = company;

                    Create(jobPost, RoleConstants.ADMIN);
                }
                response.Succeeded = true;
            }
            response.Errors = result.Response.Errors;
            return response;
        }
    }
}

