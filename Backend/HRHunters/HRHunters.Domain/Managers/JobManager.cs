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
                                        x => new JobInfo
                                        {
                                           Id = x.Id,
                                           CompanyName = x.Client.User.FirstName,
                                           CompanyEmail = x.Client.User.Email,
                                           DateTo = x.DateTo.ToShortTimeString(),
                                           JobType = x.EmpCategory.ToString(),
                                           Location = x.Location,
                                           JobTitle = x.Title,
                                           Status = x.Status.ToString(),
                                           AllApplicationsCount = x.Applications.Count
                                           
                                        })
                                        .Applyfilters(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery)
                                        .ToList();
        }
        public IEnumerable<JobPosting> CreateJobPosting(JobSubmit jobSubmit)
        {
            return null;
        }

        public JobPosting GetOneJobPosting(int id)
        {
            return _repo.GetOne<JobPosting>(x => x.Id == id);   
        }
    }
}
