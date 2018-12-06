using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Enums;

namespace HRHunters.Domain.Managers
{
    public class JobManager : BaseManager, IJobManager
    {
        private readonly IRepository _repo;
        public JobManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }

        public IEnumerable<JobInfo> GetMultiple(QueryParams queryParams, JobPostingStatus filterBy)
        {
            if (string.IsNullOrEmpty(queryParams.SortedBy))
                if (string.IsNullOrEmpty(queryParams.SortedBy))
                    queryParams.SortedBy = "Id";
            var propertyInfo = typeof(JobPosting).GetProperty(queryParams.SortedBy)
                                    ?? typeof(Client).GetProperty(queryParams.SortedBy)
                                            ?? typeof(User).GetProperty(queryParams.SortedBy);
            var reflectedType = propertyInfo.ReflectedType;
            return _repo.Get<JobPosting>(orderBy: reflectedType.Equals(typeof(JobPosting)) ? queryParams.SortedBy
                                                : reflectedType.Equals(typeof(Client)) ? "Client." + queryParams.SortedBy
                                                : "User." + queryParams.SortedBy,
                                                includeProperties: $"{nameof(JobPosting.Client)}," + $"{nameof(JobPosting.Client.User)}",
                                                skip: (queryParams.CurrentPage - 1) * queryParams.PageSize,
                                                take: queryParams.PageSize)
                                                .Select(x => new JobInfo
                                                {
                                                    Id = x.Id,
                                                    Applications = x.Applications.Count,
                                                    CompanyName = x.Client.User.FirstName,
                                                    ContactEmail = x.Client.User.Email,
                                                    Expires = x.DateTo.ToString(),
                                                    JobType = x.EmpCategory,
                                                    Location = x.Client.Location,
                                                    PositionTitle = x.Title,
                                                    Status = x.Status
                                                });
        }
        public IEnumerable<JobPosting> CreateJobPosting(JobSubmit jobSubmit)
        {
            return null;
        }
    }
}
