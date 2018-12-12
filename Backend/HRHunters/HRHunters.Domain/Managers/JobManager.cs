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

namespace HRHunters.Domain.Managers
{
    public class JobManager : BaseManager, IJobManager
    {
        private readonly IRepository _repo;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        public JobManager(IRepository repo, UserManager<User> userManager, IMapper mapper) : base(repo)
        {
            _repo = repo;
            _userManager = userManager;
            _mapper = mapper;
        }

        public JobInfo ToJobInfo(JobPosting x)
        {
            return new JobInfo()
            {
                CompanyEmail = x.Client.User.Email,
                CompanyName = x.Client.User.FirstName,
                AllApplicationsCount = x.Applications.Count,
                DateTo = x.DateTo.ToString("yyyy/MM/dd"),
                Id = x.Id,
                JobTitle = x.Title,
                JobType = x.EmpCategory.ToString(),
                Status = x.Status.ToString(),
            };
        }

        public async Task<JobResponse> GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery, int id)
        {
            var response = new JobResponse() { JobPostings = new List<JobInfo>() };
            var user = await _userManager.FindByIdAsync(id.ToString());
            IList<string> role = new List<string>();
            if (user != null)
                role = _userManager.GetRolesAsync(user).Result;
            else
                throw new NullReferenceException("Request was not processed, front-end needs work.");
            if (role != null)
            {
                var queryApplicant = _repo.GetAll<JobPosting>(
                        includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}"
                        ).Where(x => role.Contains("Applicant")
                                        ? x.Client.Status == ClientStatus.Active && x.Status == JobPostingStatus.Approved
                                            : role.Contains("Client") ? x.ClientId == id
                                                : x.Status.GetType().IsEnum);

                var selected = _mapper.ProjectTo<JobInfo>(queryApplicant)
                    .Applyfilters(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery);

                response.JobPostings.AddRange(selected.ToList());
            }
            var groupings = _repo.GetAll<JobPosting>()
                                        .GroupBy(x => x.Status)
                                        .Select(x => new
                                        {
                                            Status = x.Key,
                                            Count = x.Count()
                                        }).ToList();
            
            response.MaxJobPosts = groupings.Sum(x => x.Count);
            response.Approved = groupings.Where(x => x.Status.Equals(JobPostingStatus.Approved)).Select(x => x.Count).FirstOrDefault();
            response.Pending = groupings.Where(x => x.Status.Equals(JobPostingStatus.Pending)).Select(x => x.Count).FirstOrDefault();
            response.Rejected = groupings.Where(x => x.Status.Equals(JobPostingStatus.Rejected)).Select(x => x.Count).FirstOrDefault();
            response.Expired = groupings.Where(x => x.Status.Equals(JobPostingStatus.Expired)).Select(x => x.Count).FirstOrDefault();

            return response;
        }

        public async Task<object> CreateJobPosting(JobSubmit jobSubmit)
        {
            var company = new Client();
            var list = new List<string>();
            var response = new GeneralResponse()
            {
                Succeeded = true,
                Errors = new Dictionary<string, List<string>>()
            };
            if (jobSubmit != null && !jobSubmit.ExistingCompany)
            {
                User user = new User()
                {
                    FirstName = jobSubmit.CompanyName,
                    Email = jobSubmit.CompanyEmail,
                    UserName = jobSubmit.CompanyName,
                    CreatedBy = "Admin"
                };
                var userExists = await _userManager.FindByEmailAsync(user.Email);
                if (userExists != null)
                {
                    response.Succeeded = false;
                    list.Add("Company already exists.");
                    response.Errors.Add("Error", list);
                    return response;
                }

                await _userManager.CreateAsync(user, "ClientDefaultPassword");
                await _userManager.AddToRoleAsync(user, "Client");
                company.User = user;
                company.Location = "Default Location";
                company.Status = ClientStatus.Active;
                company.PhoneNumber = "+38978691342";
                _repo.Create(company, "Admin");
            }
            else if (jobSubmit.ExistingCompany && jobSubmit != null && jobSubmit.Id > 0)
            {
                company = _repo.Get<Client>(filter: x => x.Id == jobSubmit.Id, includeProperties: $"{nameof(User)}").FirstOrDefault();
            }
            else
            {
                response.Succeeded = false;
                list.Add("Invalid input");
                response.Errors.Add("Error", list);
                return response;
            }
            DateTime.TryParse(jobSubmit.DateFrom, out DateTime dateFrom);
            DateTime.TryParse(jobSubmit.DateTo, out DateTime dateTo);
            Enum.TryParse(jobSubmit.Education, out EducationType educationType);
            Enum.TryParse(jobSubmit.JobType, out JobType jobType);
            var jobPost = new JobPosting()
            {
                Client = company,
                CreatedBy = "Admin",
                DateFrom = dateFrom,
                DateTo = dateTo,
                Description = jobSubmit.Description,
                Education = educationType,
                EmpCategory = jobType,
                Title = jobSubmit.JobTitle,
                NeededExperience = jobSubmit.Experience,
                Status = JobPostingStatus.Approved,
            };
            _repo.Create(jobPost, "Admin");
            return response;
        }

        public JobInfo GetOneJobPosting(int id)
        {
            var response = new JobResponse() { JobPostings = new List<JobInfo>() };
            var jobPost = _repo.GetOne<JobPosting>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");
            return ToJobInfo(jobPost);

        }

        public GeneralResponse UpdateJob(JobUpdate jobUpdate)
        {
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
