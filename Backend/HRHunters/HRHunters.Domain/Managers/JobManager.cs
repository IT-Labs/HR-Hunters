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

namespace HRHunters.Domain.Managers
{
    public class JobManager : BaseManager, IJobManager
    {
        private readonly IRepository _repo;
        public JobManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }

        public JobResponse GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy,string filterQuery)
        {
            var response = new JobResponse() { JobPosting = new List<JobInfo>() };
            var query =  _repo.GetAll<JobPosting>(
                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}")
                                        .Select(
                                        x => new JobInfo()
                                        {
                                            CompanyEmail = x.Client.User.Email,
                                            CompanyName = x.Client.User.FirstName,
                                            AllApplicationsCount = x.Applications.Count,
                                            DateTo = x.DateTo.ToString("d", DateTimeFormatInfo.InvariantInfo),
                                            Id = x.Id,
                                            JobTitle = x.Title,
                                            JobType = x.EmpCategory.ToString(),
                                            Location = x.Location,
                                            Status = x.Status.ToString(),
                                        })
                                        .Applyfilters(pageSize: pageSize, currentPage: currentPage, sortedBy: sortedBy, sortDir: sortDir, filterBy: filterBy, filterQuery: filterQuery)
                                        .ToList();
            response.JobPosting.AddRange(query);
            response.MaxJobPosts = _repo.GetCount<JobPosting>();
            response.Approved = _repo.GetCount<JobPosting>(x => x.Status == JobPostingStatus.Approved);
            response.Pending = _repo.GetCount<JobPosting>(x => x.Status == JobPostingStatus.Pending);
            response.Rejected = _repo.GetCount<JobPosting>(x => x.Status == JobPostingStatus.Rejected);

            return response;
        }
        public IEnumerable<JobPosting> CreateJobPosting(JobSubmit jobSubmit)
        {
            return null;
        }

        public JobInfo GetOneJobPosting(int id)
        {
            var jobPost =  _repo.GetOne<JobPosting>(filter: x => x.Id == id, 
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");
            return new JobInfo()
            {
                CompanyEmail = jobPost.Client.User.Email,
                CompanyName = jobPost.Client.User.FirstName,
                AllApplicationsCount = jobPost.Applications.Count,
                DateTo = jobPost.DateTo.ToString("d", DateTimeFormatInfo.InvariantInfo),
                Id = jobPost.Id,
                JobTitle = jobPost.Title,
                JobType = jobPost.EmpCategory.ToString(),
                Location = jobPost.Location,
                Status = jobPost.Status.ToString(),
            };

        }

        public JobInfo UpdateJob(int id, string status, JobUpdate jobUpdate)
        {
            var jobPost = _repo.GetOne<JobPosting>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");
            if (!string.IsNullOrEmpty(status))
            { 
                var statusToUpdate = jobPost.Status;
                Enum.TryParse(status, out statusToUpdate);
                jobPost.Status = statusToUpdate;
            }else 
            if(jobUpdate != null) {
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
            _repo.Update(jobPost, "Admin");

            return new JobInfo()
            {
                CompanyEmail = jobPost.Client.User.Email,
                CompanyName = jobPost.Client.User.FirstName,
                AllApplicationsCount = jobPost.Applications.Count,
                DateTo = jobPost.DateTo.ToString("d", DateTimeFormatInfo.InvariantInfo),
                Id = jobPost.Id,
                JobTitle = jobPost.Title,
                JobType = jobPost.EmpCategory.ToString(),
                Location = jobPost.Location,
                Status = jobPost.Status.ToString(),
            };
        }
    }
}
