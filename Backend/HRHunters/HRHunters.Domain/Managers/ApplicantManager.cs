using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.Applicants;
using HRHunters.Data;

namespace HRHunters.Domain.Managers
{
    public class ApplicantManager : BaseManager, IApplicantManager
    {
        private readonly IRepository _repo;
        public ApplicantManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }

        public IEnumerable<ApplicantInfo> GetMultiple()
        {

            return _repo.Get<Applicant>(includeProperties: $"{nameof(Applicant.User)}")
                .Select(
                x => new ApplicantInfo {
                    FirstName = x.User.FirstName,
                    LastName = x.User.LastName,
                    Email = x.User.Email,
                    PhoneNumber = x.PhoneNumber});
        }
    }
}
