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

        public IEnumerable<JobInfo> GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy,string filterQuery)
        {
            return _repo.GetAll<JobPosting>(
                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}")
                                        .Applyfilters(pageSize: pageSize, currentPage: currentPage, sortedBy: sortedBy, sortDir: sortDir, filterBy: filterBy, filterQuery: filterQuery)
                                        .Select(
                                        x => new JobInfo().JobInformation(x))
                                        .ToList();
        }
        public IEnumerable<JobPosting> CreateJobPosting(JobSubmit jobSubmit)
        {

            return null;
        }

        public JobPosting GetOneJobPosting(int id)
        {
            return _repo.GetOne<JobPosting>(filter: x => x.Id == id, 
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");

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

            return new JobInfo().JobInformation(jobPost);
        }
    }
}
