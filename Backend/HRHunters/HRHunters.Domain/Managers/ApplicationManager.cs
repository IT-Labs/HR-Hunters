using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
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

        public class Filters<T>
        {
            public IEnumerable<T> Applyfilters(IEnumerable<T> a, int pageSize = 20, int currentPage = 1, string sortedBy = "", SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "")
            {
                if (!string.IsNullOrWhiteSpace(sortedBy))
                {
                    var pi = typeof(ApplicationInfo).GetProperty(sortedBy);
                    if (sortDir == SortDirection.DESC)
                    {
                        a = a.OrderByDescending(x => pi.GetValue(x, null));
                    }
                    if (sortDir == SortDirection.ASC)
                    {
                        a.OrderBy(x => pi.GetValue(x, null));
                    }
                }

                if (!string.IsNullOrWhiteSpace(filterBy))
                {

                    var pi = typeof(ApplicationInfo).GetProperty(filterBy);
                    a = a.Where(x => pi.GetValue(x, null).Equals(filterQuery));

                }
                return a.Skip((currentPage - 1) * pageSize).Take(pageSize);
            }
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
                    Status = x.Status.ToString()
                });


            var filter = new Filters<ApplicationInfo>();

            return filter.Applyfilters(a, pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery);
            
        }

    }
}
