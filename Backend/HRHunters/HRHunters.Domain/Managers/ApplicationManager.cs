using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Common.ExtensionMethods;
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
        public ApplicationManager(IRepository repo) : base (repo)
        {
            _repo = repo;
        }
        public IEnumerable<ApplicationInfo> GetMultiple(int? pageSize, int? currentPage, string sortedBy, SortDirection? sortDir, int? filterBy)
        {
            sortedBy = sortedBy ?? "Id";
            sortedBy = sortedBy.ToPascalCase();
            var propertyInfo = typeof(Application).GetProperty(sortedBy)
                                    ?? typeof(Applicant).GetProperty(sortedBy)
                                            ?? typeof(JobPosting).GetProperty(sortedBy)
                                                    ?? typeof(User).GetProperty(sortedBy);
            var reflectedType = propertyInfo.ReflectedType;

            return _repo.Get<Application>(orderBy: reflectedType.Equals(typeof(Application)) ? sortedBy 
                                                    : reflectedType.Equals(typeof(Applicant)) ? "Applicant."+sortedBy 
                                                    : reflectedType.Equals(typeof(JobPosting)) ? "JobPosting."+sortedBy : "Applicant.User."+sortedBy,
                                            includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)}," +
                                                                $"{nameof(JobPosting)}",
                                            skip: (currentPage - 1) * pageSize,
                                            take: pageSize,
                                            sortDirection: sortDir
                                            ).AsQueryable().WhereIf(filterBy != 0, x => ((int)x.Status).Equals(filterBy))
                                            .Select(x => new ApplicationInfo
                                            {
                                                ApplicantEmail = x.Applicant.User.Email,
                                                ApplicantName = x.Applicant.User.FirstName,
                                                Experience = x.Applicant.Experience,
                                                JobTitle = x.JobPosting.Title,
                                                Posted = x.Date.ToString(),
                                                Status = x.Status
                                            });
        }
        
    }
}
