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

        public IEnumerable<ApplicantInfo> GetMultiple(int? pageSize, int? currentPage, string sortedBy, int sortDir, string filterBy)
        {
            var sortDirection = sortDir % 2 == 0 ? true : false;
            return _repo.Get<Applicant>(orderBy: x => (!sortDirection) ? x.OrderBy(y => y.User.FirstName) : x.OrderByDescending(y => y.User.FirstName),
                includeProperties: $"{nameof(Applicant.User)}", skip: (currentPage-1)*pageSize, take: pageSize)
                .Select(
                x => new ApplicantInfo {
                    Id = x.UserId,
                    FirstName = x.User.FirstName,
                    LastName = x.User.LastName,
                    Email = x.User.Email,
                    PhoneNumber = x.PhoneNumber,
                    Photo = "Nati foto"});
        }
    }
}
