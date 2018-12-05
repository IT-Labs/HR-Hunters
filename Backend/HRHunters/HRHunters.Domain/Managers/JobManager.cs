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
            var sortDirection = sortDir % 2 == 0 ? true : false; // true -asc, false -desc
            var propertyInfo = typeof(JobPosting).GetProperty(sortedBy) 
                                    ?? typeof(Client).GetProperty(sortedBy) 
                                            ?? typeof(User).GetProperty(sortedBy);
            return _repo.Get<JobPosting>(orderBy: sortedBy,
                                         includeProperties: $"{nameof(JobPosting.Client)}", 
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
        public IEnumerable<JobSubmit> Create(JobSubmit jobSubmit)
        {

        }
    }
}
