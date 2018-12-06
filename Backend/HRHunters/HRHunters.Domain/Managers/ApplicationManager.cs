using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests.Admin;
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
        public IEnumerable<ApplicationInfo> GetMultiple(QueryParams queryParams, ApplicationStatus filterBy)
        {
            if (queryParams.SortedBy == null)
                queryParams.SortedBy = "Id";
            var propertyInfo = typeof(Application).GetProperty(queryParams.SortedBy)
                                    ?? typeof(Applicant).GetProperty(queryParams.SortedBy)
                                            ?? typeof(JobPosting).GetProperty(queryParams.SortedBy)
                                                    ?? typeof(User).GetProperty(queryParams.SortedBy);
            var reflectedType = propertyInfo.ReflectedType;

            return _repo.Get<Application>(orderBy: reflectedType.Equals(typeof(Application)) ? queryParams.SortedBy
                                                 : reflectedType.Equals(typeof(Applicant)) ? "Applicant." + queryParams.SortedBy
                                                 : reflectedType.Equals(typeof(JobPosting)) ? "JobPosting." + queryParams.SortedBy : "User" + queryParams.SortedBy,
                                                 includeProperties: $"{nameof(Application.Applicant)}," +
                                                                    $"{nameof(Application.Applicant.User)}," +
                                                                    $"{nameof(Application.JobPosting)}",
                                                 skip: (queryParams.CurrentPage - 1) * queryParams.PageSize,
                                                 take: queryParams.PageSize
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
