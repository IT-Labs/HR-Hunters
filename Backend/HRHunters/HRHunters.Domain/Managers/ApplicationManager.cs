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
            return _repo.GetAll<Application>(
                includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)}," +
                                   $"{nameof(JobPosting)}")
                                   .Select(x => new ApplicationInfo
                                   {
                                        ApplicantEmail = x.Applicant.User.Email,
                                        ApplicantName = x.Applicant.User.FirstName,
                                        Experience = x.Applicant.Experience,
                                        Id = x.Id,
                                        JobTitle = x.JobPosting.Title,
                                        PostedOn = x.Date.ToString(),
                                        Status = x.Status.ToString()
                                   })
                                   .Applyfilters(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery)
                                   .ToList();
        }
        
        public ApplicationInfo UpdateApplicationStatus(int id, string status)
        {
            var application = _repo.Get<Application>(filter: x => x.Id == id, 
                                                    includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)},{nameof(JobPosting)}").FirstOrDefault();
            var statusToUpdate = application.Status;
            Enum.TryParse(status, out statusToUpdate);
            application.Status = statusToUpdate;
            _repo.Update(application, "Admin");
            return new ApplicationInfo()
            {

                ApplicantEmail = application.Applicant.User.Email,
                ApplicantName = application.Applicant.User.FirstName,
                Experience = application.Applicant.Experience,
                Id = application.Id,
                JobTitle = application.JobPosting.Title,
                PostedOn = application.Date.ToString(),
                Status = application.Status.ToString()

            };
        }
    }
}