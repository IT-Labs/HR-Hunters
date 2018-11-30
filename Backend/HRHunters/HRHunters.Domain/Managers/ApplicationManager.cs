using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Data;
using System;
using System.Collections.Generic;
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
        public IEnumerable<Application> GetMultiple()
        {
            return _repo.Get<Application>(includeProperties: $"{nameof(Application.Applicant.User.FirstName)}," +
                                                                $"{nameof(Application.Applicant.User.LastName)}," +
                                                                $"{nameof(Application.Applicant.User.Email)}," +
                                                                $"{nameof(Application.JobPosting.Title)}," +
                                                                $"{nameof(Application.Applicant.Experience)}," +
                                                                $"{nameof(Application.Date)}," +
                                                                $"{nameof(Application.Status)}");
        }
        
    }
}
