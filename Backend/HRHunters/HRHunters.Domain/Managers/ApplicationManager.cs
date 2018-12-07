using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.ExtensionMethods;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HRHunters.Domain.Managers
{

    public class ApplicationManager : BaseManager, IApplicationManager
    {
        private readonly IRepository _repo;
        public ApplicationManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }

        

        public IEnumerable<ApplicationInfo> GetMultiple(int pageSize = 20, int currentPage = 1, string sortedBy = "", SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "")
        {
            var a = _repo.GetAll<Application>(includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)}," +
                                                                $"{nameof(JobPosting)}").Select(
                x => new ApplicationInfo
                {
                    
                    ApplicantEmail = x.Applicant.User.Email,
                    ApplicantName = x.Applicant.User.FirstName,
                    Experience = x.Applicant.Experience,
                    JobTitle = x.JobPosting.Title,
                    Posted = x.Date.ToString(),
                    Status = x.Status.ToString(),
                });


            var filter = new Filters<ApplicationInfo>();

            return filter.Applyfilters(a, pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery);

        }

    }
}