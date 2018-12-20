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
using System.Text.RegularExpressions;

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
            IList<string> role = _userManager.GetRolesAsync(current).Result;
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

            if (!dateFromParse || !dateToParse || !educationParse || !empCategoryParse)
            {
                _logger.LogError(ErrorConstants.InvalidInput, dateFrom, dateTo, education, empCategory);
                response.Errors["Error"].Add(ErrorConstants.InvalidInput);
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
                }
                catch
                {
                    _logger.LogError(ErrorConstants.FailedToUpdateDatabase, jobPost);
                    response.Errors["Error"].Add(ErrorConstants.FailedToUpdateDatabase);
                }
            }
            else
            {
                jobPost.Status = JobPostingStatus.Approved;
                try
                {
                    _repo.Create(jobPost, RoleConstants.ADMIN);
                    response.Succeeded = true;
                }
                catch
                {
                    _logger.LogError(ErrorConstants.FailedToUpdateDatabase, jobPost);
                    response.Errors["Error"].Add(ErrorConstants.FailedToUpdateDatabase);
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

            if (!string.IsNullOrEmpty(jobUpdate.Status) && jobPost != null)
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
            if (jobPost != null && jobUpdate != null)
            {
                jobPost = _mapper.Map(jobUpdate, jobPost);
                bool jobTypeParse = Enum.TryParse(jobUpdate.JobType, out JobType currentJobType);
                bool educationParse = Enum.TryParse(jobUpdate.Education, out EducationType currentEducation);
                bool dateFromParse = DateTime.TryParse(jobUpdate.DateFrom, out DateTime dateFrom);
                bool dateToParse = DateTime.TryParse(jobUpdate.DateTo, out DateTime dateTo);
                if (!jobTypeParse || !educationParse || !dateToParse || !dateToParse)
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
                _repo.Update(jobPost, UserType.ADMIN.ToString());
                response.Succeeded = true;
            }
            catch
            {
                _logger.LogError(ErrorConstants.FailedToUpdateDatabase);
                response.Errors["Error"].Add(ErrorConstants.FailedToUpdateDatabase);
            }

            return response;
        }

        public GeneralResponse CreateMultiple(IFormFile formFile, int id)
        {
            var errorLine = new List<int>();
            var response = new GeneralResponse();
            var _listJobs = new List<JobSubmit>();
            var result = string.Empty;
            if(formFile.ContentType != "application/vnd.ms-excel")
            {
                response.Errors["Error"].Add("The file must be in csv format");
                return response;
            }

            if (!(formFile.Length > 0))
            {
                response.Errors["Error"].Add("The csv file is empty!");
                return response;
            }


            var reader = new StreamReader(formFile.OpenReadStream());
            
            var iteration = 0;
            var csv = new CsvReader(reader);
            while (csv.Read())
            {
                if (iteration == 0)
                {
                    if (
                        !csv[0].Equals("Title") ||
                        !csv[1].Equals("Description") ||
                        !csv[2].Equals("Type") ||
                        !csv[3].Equals("Education") ||
                        !csv[4].Equals("Experience") ||
                        !csv[5].Equals("DateFrom") ||
                        !csv[6].Equals("DateTo")
                        )
                    {
                     response.Errors["Error"].Add("The header columns must in the following order: Title, Description, Type, Education, Experience, DateFrom, DateTo ");
                    }
                    iteration++;
                    continue;
                }
                var _Job = new JobSubmit();
                 


                if (
                   !Regex.Match(csv[0].ToString(), "[A-Za-z]").Success||csv[0].Length>30||
                   !Regex.Match(csv[1].ToString(), "[a-zA-Z0-9]").Success||csv[1].Length>800||
                   !Regex.Match(csv[2].ToString(), "").Success||
                   !Regex.Match(csv[3].ToString(), "Highschool|Bachelor|Master|Doctoral").Success||
                   !Regex.Match(csv[4].ToString(), "[A-Za-z]").Success||csv[4].Length>3||
                   !Regex.Match(csv[5].ToString(), "[A-Za-z]").Success||
                   !Regex.Match(csv[6].ToString(), "[A-Za-z]").Success
                   )
                {
                    response.Errors["Error"].Add("Invalid input at line"+iteration);
                }                
                _Job.Title = csv[0];
                _Job.Description = csv[1];
                _Job.EmpCategory = csv[2];
                _Job.Education = csv[3];
                _Job.NeededExperience = csv[4];
                _Job.DateFrom = csv[5];
                _Job.DateTo = csv[6];
                _Job.Id = id;
                _listJobs.Add(_Job);
                iteration++;
            }

            var company = _repo.GetById<Client>(id);
            foreach (var job in _listJobs)
            {
                var jobPost = new JobPosting()
                {
                    Client = company,
                };
                jobPost = _mapper.Map(job, jobPost);
                bool dateFromParse = DateTime.TryParse(job.DateFrom, out DateTime dateFrom);
                bool dateToParse = DateTime.TryParse(job.DateTo, out DateTime dateTo);
                bool educationParse = Enum.TryParse(job.Education, out EducationType education);
                bool empCategoryParse = Enum.TryParse(job.EmpCategory, out JobType empCategory);

                if (!dateFromParse || !dateToParse || !educationParse || !empCategoryParse)
                {
                    _logger.LogError(ErrorConstants.InvalidInput, dateFrom, dateTo, education, empCategory);
                    response.Errors["Error"].Add(ErrorConstants.InvalidInput);
                }
                jobPost.Status = JobPostingStatus.Approved;
                jobPost.DateFrom = dateFrom;
                jobPost.DateTo = dateTo;
                jobPost.EmpCategory = empCategory;
                jobPost.Education = education;

                //_repo.Create(jobPost, RoleConstants.ADMIN);
            }
            return response;
        }
    }
}

