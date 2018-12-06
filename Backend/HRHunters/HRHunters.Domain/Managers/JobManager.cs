using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using HRHunters.Common.Requests.Users;

namespace HRHunters.Domain.Managers
{
    public class JobManager : BaseManager, IJobManager
    {
        private readonly IRepository _repo;
        public JobManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }

        public IEnumerable<JobInfo> GetMultiple(int? pageSize, int? currentPage, string sortedBy, int sortDir, string filterBy)
        {
            if (string.IsNullOrEmpty(sortedBy))
                sortedBy = "Id";
            var propertyInfo = typeof(JobPosting).GetProperty(sortedBy) 
                                    ?? typeof(Client).GetProperty(sortedBy) 
                                            ?? typeof(User).GetProperty(sortedBy);
            var reflectedType = propertyInfo.ReflectedType;
            return _repo.Get<JobPosting>(orderBy: reflectedType.Equals(typeof(JobPosting)) ? sortedBy
                                                    : reflectedType.Equals(typeof(Client)) ? "Client."+ sortedBy : "User." + sortedBy,
                                         includeProperties: $"{nameof(JobPosting.Client)}," + $"{nameof(JobPosting.Client.User)}", 
                                         skip: (currentPage - 1) * pageSize, 
                                         take: pageSize)
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
