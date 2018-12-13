using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.ExtensionMethods;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Domain.Managers
{

    public class ApplicationManager : BaseManager, IApplicationManager
    {
        private readonly IRepository _repo;
        public ApplicationManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }

        public ApplicationInfo ToApplicationInfo(Application application)
        {
            return new ApplicationInfo()
            {
                ApplicantEmail = application.Applicant.User.Email,
                ApplicantFirstName = application.Applicant.User.FirstName,
                ApplicantLastName = application.Applicant.User.LastName,
                Experience = application.Applicant.Experience,
                Id = application.Id,
                JobTitle = application.JobPosting.Title,
                PostedOn = application.Date.ToString("yyyy/MM/dd"),
                Status = application.Status.ToString()
            };
        }

        public ApplicationResponse GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery, int id)
        {
            var response = new ApplicationResponse() { Applications = new List<ApplicationInfo>() };

            if (id != 0)
            {
                var queryOwn = _repo.GetAll<Application>(
               includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)}," +
                                  $"{nameof(JobPosting)}").Where(x => x.ApplicantId == id).Select(x => new ApplicationInfo
                                  {
                                      JobTitle = x.JobPosting.Title,
                                      Description = x.JobPosting.Description,
                                      PostedOn = x.Date.ToString()
                                  });
                response.Applications.AddRange(queryOwn);

            }
            else
            {
                var query = _repo.GetAll<Application>(
                   includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)}," +
                                      $"{nameof(JobPosting)}")
                                      .Select(x => new ApplicationInfo
                                      {
                                          ApplicantEmail = x.Applicant.User.Email,
                                          ApplicantFirstName = x.Applicant.User.FirstName,
                                          ApplicantLastName = x.Applicant.User.LastName,
                                          Experience = x.Applicant.Experience,
                                          Id = x.Id,
                                          JobTitle = x.JobPosting.Title,
                                          PostedOn = x.Date.ToString("yyyy/MM/dd"),
                                          Status = x.Status.ToString()
                                      })
                                      .Applyfilters(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery)
                                      .ToList();

                response.Applications.AddRange(query);
                response.MaxApplications = _repo.GetCount<Application>();
                response.Contacted = _repo.GetCount<Application>(x => x.Status.Equals(ApplicationStatus.Contacted));
                response.Pending = _repo.GetCount<Application>(x => x.Status.Equals(ApplicationStatus.Pending));
                response.Hired = _repo.GetCount<Application>(x => x.Status.Equals(ApplicationStatus.Hired));
                response.Interviewed = _repo.GetCount<Application>(x => x.Status.Equals(ApplicationStatus.Interviewed));
                response.Rejected = _repo.GetCount<Application>(x => x.Status.Equals(ApplicationStatus.Rejected));
            }
            return response;

        }

        public ApplicationInfo UpdateApplicationStatus(int id, string status)
        {
            var application = _repo.Get<Application>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(Applicant)}.{nameof(Applicant.User)},{nameof(JobPosting)}").FirstOrDefault();

            Enum.TryParse(status, out ApplicationStatus statusToUpdate);
            application.Status = statusToUpdate;
            _repo.Update(application, "Admin");
            return ToApplicationInfo(application);
        }
        public GeneralResponse CreateApplication(Apply apply, string currentUserId)
        {
            var active = _repo.Get<JobPosting>(filter: x => x.Id == apply.JobId).FirstOrDefault();
            var applicant = _repo.Get<Applicant>(filter: x => x.Id == apply.ApplicantId, includeProperties: $"{nameof(User)}").FirstOrDefault();
            var list = new List<string>();
            var response = new GeneralResponse()
            {
                Succeeded = false,
                Errors = new Dictionary<string, List<string>>()
            };

            if (apply.ApplicantId != (int.Parse(currentUserId)) || active == null)
            {
                response.Errors.Add("Error", new List<string> { "Invalid input" });
                response.Succeeded = false;
            }
            else if (active.Status == JobPostingStatus.Approved)
            {                                               
                var application = new Application()
                {
                    ApplicantId = apply.ApplicantId,
                    Date = DateTime.UtcNow,
                    JobPostingId = apply.JobId,
                    Status = ApplicationStatus.Pending
                };
                _repo.Create(application, applicant.User.FirstName);
                response.Succeeded = true;
            }
            return response;

        }
    }
}