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
        public ApplicationManager(IRepository repo) : base (repo)
        {
            _repo = repo;
        }
        public IEnumerable<ApplicationInfo> GetMultiple(int? pageSize, int? currentPage, string sortedBy, int sortDir, string filterBy)
        {
            if(sortedBy == null)
                sortedBy = "Id";
            var propertyInfo = typeof(Application).GetProperty(sortedBy)
                                    ?? typeof(Applicant).GetProperty(sortedBy)
                                            ?? typeof(JobPosting).GetProperty(sortedBy)
                                                    ?? typeof(User).GetProperty(sortedBy);
            var reflectedType = propertyInfo.ReflectedType;

            return _repo.Get<Application>(orderBy: reflectedType.Equals(typeof(Application)) ? sortedBy 
                                                    : reflectedType.Equals(typeof(Applicant)) ? "Applicant."+sortedBy 
                                                    : reflectedType.Equals(typeof(JobPosting)) ? "JobPosting."+sortedBy : "User"+sortedBy,
                                            includeProperties: $"{nameof(Application.Applicant)}," +
                                                                $"{nameof(Application.Applicant.User)}," +
                                                                $"{nameof(Application.JobPosting)}",
                                            skip: (currentPage - 1) * pageSize,
                                            take: pageSize
                                            ).Select(x => new ApplicationInfo
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
