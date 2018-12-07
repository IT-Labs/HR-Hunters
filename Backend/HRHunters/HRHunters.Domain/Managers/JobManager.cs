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
            var a = _repo.GetAll<JobPosting>(includeProperties:$"{nameof(JobPosting.Client)}").Select(
                x => new JobInfo
                {
                   PositionTitle=x.Title,
                   CompanyName=x.Client.User.FirstName,
                   ContactEmail=x.Client.User.Email,
                   Location=x.Client.Location,
                   
                });


            var filter = new Filters<JobInfo>();

            return filter.Applyfilters(a, pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery);

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
