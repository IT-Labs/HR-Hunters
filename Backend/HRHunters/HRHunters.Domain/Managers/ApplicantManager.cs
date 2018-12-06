using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.AdminDashboard;
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
        public IEnumerable<ApplicantInfo> GetMultiple(int? pageSize, int? currentPage, string sortedBy, SortDirection? sortDir)
        {
            var sortDirection = sortDir.Equals(SortDirection.ASC) ? true : false;

            if(sortedBy == null)
                sortedBy = "Id";

            var propertyInfo = typeof(Applicant).GetProperty(sortedBy) ?? typeof(User).GetProperty(sortedBy);
            
            return _repo.Get<Applicant>(orderBy: propertyInfo.ReflectedType.Equals(typeof(User)) ? "User." + sortedBy : sortedBy,
                                        includeProperties: $"{nameof(Applicant.User)}", skip: (currentPage-1)*pageSize, take: pageSize, sortDirection: sortDir)
                                        .Select(
                                        x => new ApplicantInfo
                                        {
                                            Id = x.Id,
                                            FirstName = x.User.FirstName,
                                            LastName = x.User.LastName,
                                            Email = x.User.Email,
                                            PhoneNumber = x.PhoneNumber,
                                            Photo = "Nati foto",
                                        });
        }
    }
}
