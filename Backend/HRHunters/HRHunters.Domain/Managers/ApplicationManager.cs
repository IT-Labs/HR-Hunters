using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.ExtensionMethods;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
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

        

        public ApplicationResponse GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery)
        {
            var response = new ApplicationResponse() { Application = new List<ApplicationInfo>()};

            var query = _repo.GetAll<Application>(
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

            response.Application.AddRange(query);
            response.MaxApplications = _repo.GetCount<Application>();
            response.Contacted = _repo.GetCount<Application>(x=>x.Status.Equals(ApplicationStatus.Contacted));
            response.Pending = _repo.GetCount<Application>(x => x.Status.Equals(ApplicationStatus.Pending));
            response.Hired = _repo.GetCount<Application>(x => x.Status.Equals(ApplicationStatus.Hired));
            response.Interviewed = _repo.GetCount<Application>(x => x.Status.Equals(ApplicationStatus.Interviewed));
            response.Rejected = _repo.GetCount<Application>(x => x.Status.Equals(ApplicationStatus.Rejected));
            return response;

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