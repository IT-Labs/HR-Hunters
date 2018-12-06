using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests.Admin;
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
        public IEnumerable<ApplicantInfo> GetMultiple(QueryParams queryParams)
        {
            var sortDirection = queryParams.SortDir.Equals(SortDirection.ASC) ? true : false;

            if(queryParams.SortedBy == null)
                queryParams.SortedBy = "Id";

            var propertyInfo = typeof(Applicant).GetProperty(queryParams.SortedBy) ?? typeof(User).GetProperty(queryParams.SortedBy);
            
            return _repo.Get<Applicant>(orderBy: propertyInfo.ReflectedType.Equals(typeof(User)) ? "User." + queryParams.SortedBy : queryParams.SortedBy,
                                        includeProperties: $"{nameof(Applicant.User)}",
                                        skip: (queryParams.CurrentPage - 1)* queryParams.PageSize,
                                        take: queryParams.PageSize,
                                        sortDirection: queryParams.SortDir)
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
