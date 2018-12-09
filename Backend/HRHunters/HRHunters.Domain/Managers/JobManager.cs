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
                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)}, {nameof(JobPosting.Applications)}")
                                        .Select(
                                        x => new JobInfo().JobInformation(x))
                                        .Applyfilters(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery)
                                        .ToList();
        }
        public IEnumerable<JobPosting> CreateJobPosting(JobSubmit jobSubmit)
        {
            return null;
        }

        public JobInfo GetOneJobPosting(int id)
        {
            var jobpost = _repo.GetOne<JobPosting>(filter: x => x.Id == id, 
                                        includeProperties: $"{nameof(Client)}.{nameof(Client.User)}, {nameof(JobPosting.Applications)}");

            return new JobInfo().JobInformation(jobpost);
        }

        public JobInfo UpdateJobStatus(int id, string status)
        {
            var jobPost = _repo.GetOne<JobPosting>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(Client)}.{nameof(Client.User)},{nameof(JobPosting.Applications)}");
            var statusToUpdate = jobPost.Status;
            Enum.TryParse(status, out statusToUpdate);
            jobPost.Status = statusToUpdate;
            _repo.Update(jobPost, "Admin");

            return new JobInfo().JobInformation(jobPost);
        }
    }
}
