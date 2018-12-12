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

namespace HRHunters.Domain.Managers
{
    public class JobManager : BaseManager, IJobManager
    {
        private readonly IRepository _repo;
        private readonly UserManager<User> _userManager;
        public JobManager(IRepository repo, UserManager<User> userManager) : base(repo)
        {
            _repo = repo;
            _userManager = userManager;
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
            {
                 role = _userManager.GetRolesAsync(user).Result;
            }
            if (role.Contains("Applicant"))
            {
                var queryApplicant = _repo.GetAll<JobPosting>(
                        includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}"
                        ).Where(x => x.Client.Status == ClientStatus.Active && x.Status == JobPostingStatus.Approved)
                        .Select(
                        x => new JobInfo()
                        {
                            DateTo = x.DateTo.ToString("yyyy/MM/dd"),
                            JobTitle = x.Title,
                            Description = x.Description,
                            JobType = x.EmpCategory.ToString(),
                            Status = x.Status.ToString(),
                        }
                    );
                response.JobPostings.AddRange(queryApplicant);
            }
            else if(role.Contains("Client"))
            {
                var queryClient = _repo.GetAll<JobPosting>(
                        includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}"
                        ).Where(x=>x.ClientId==id)
                        .Select(
                        x => new JobInfo()
                        {
                            DateTo = x.DateTo.ToString("yyyy/MM/dd"),
                            JobTitle = x.Title,
                            Description = x.Description,
                            JobType = x.EmpCategory.ToString(),
                            Status = x.Status.ToString(),
                        }
                    );
                response.JobPostings.AddRange(queryClient);           
            }

            else
            {
                var query = _repo.GetAll<JobPosting>(
                        includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}")
                                            .Select(
                                            x => new JobInfo()
                                            {
                                                CompanyEmail = x.Client.User.Email,
                                                CompanyName = x.Client.User.FirstName,
                                                AllApplicationsCount = x.Applications.Count,
                                                DateTo = x.DateTo.ToString("yyyy/MM/dd"),
                                                Id = x.Id,
                                                JobTitle = x.Title,
                                                JobType = x.EmpCategory.ToString(),
                                                Status = x.Status.ToString(),
                                            })
                                            .Applyfilters(pageSize: pageSize, currentPage: currentPage, sortedBy: sortedBy, sortDir: sortDir, filterBy: filterBy, filterQuery: filterQuery)
                                            .ToList();
                response.JobPostings.AddRange(query);
                response.MaxJobPosts = _repo.GetCount<JobPosting>();
                response.Approved = _repo.GetCount<JobPosting>(x => x.Status == JobPostingStatus.Approved);
                response.Pending = _repo.GetCount<JobPosting>(x => x.Status == JobPostingStatus.Pending);
                response.Rejected = _repo.GetCount<JobPosting>(x => x.Status == JobPostingStatus.Rejected);
                response.Expired = _repo.GetCount<JobPosting>(x => x.Status == JobPostingStatus.Expired);
            }
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

        public GeneralResponse UpdateJob(int id, string status, JobUpdate jobUpdate)
        {
            var response = new GeneralResponse()
            {
                Succeeded = true,
                Errors = new Dictionary<string, List<string>>(),
            };
            var jobPost = _repo.GetOne<JobPosting>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");
            if (!string.IsNullOrEmpty(status))
            {
                var statusToUpdate = jobPost.Status;
                Enum.TryParse(status, out statusToUpdate);
                jobPost.Status = statusToUpdate;
            }
            else
            if (jobUpdate != null)
            {
                jobPost.Title = jobUpdate.JobTitle;
                jobPost.Description = jobUpdate.Description;
                var currentJobType = jobPost.EmpCategory;
                Enum.TryParse(jobUpdate.JobType, out currentJobType);
                jobPost.EmpCategory = currentJobType;
                var currentEducation = jobPost.Education;
                Enum.TryParse(jobUpdate.Education, out currentJobType);
                jobPost.Education = currentEducation;
                jobPost.NeededExperience = jobUpdate.Experience;
                DateTime.TryParse(jobUpdate.DateFrom, out DateTime date);
                jobPost.DateFrom = date;
                DateTime.TryParse(jobUpdate.DateTo, out date);
                jobPost.DateTo = date;
            }
            else
            {
                var list = new List<string>();
                list.Add("Invalid input");
                response.Errors.Add("Error", list);
                response.Succeeded = false;
                return response;
            }
            _repo.Update(jobPost, "Admin");

            return response;
        }
    }
}
