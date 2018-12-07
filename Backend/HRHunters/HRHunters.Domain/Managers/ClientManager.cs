using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Common.ExtensionMethods;
using HRHunters.Data;

namespace HRHunters.Domain.Managers
{
    public class ClientManager : BaseManager, IClientManager
    {
        private readonly IRepository _repo;
        public ClientManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }
        public IEnumerable<ClientInfo> GetMultiple(int? pageSize, int? currentPage, string sortedBy, SortDirection sortDir, int? filterBy)
        {
            sortedBy = sortedBy ?? "Id";
            sortedBy = sortedBy.ToPascalCase();

            var propertyInfo = typeof(Applicant).GetProperty(sortedBy) ?? typeof(User).GetProperty(sortedBy);

            return _repo.Get<Client>(orderBy: propertyInfo.ReflectedType.Equals(typeof(User)) ? "User." + sortedBy : sortedBy,
                                        includeProperties: $"{nameof(User)}," + $"{nameof(Client.JobPostings)}",
                                        skip: (currentPage - 1) * pageSize,
                                        take: pageSize,
                                        sortDirection: sortDir
                                        ).AsQueryable().WhereIf(filterBy != 0, x => ((int)x.Status).Equals(filterBy))
                                        .Select(
                                        x => new ClientInfo
                                        {
                                            Id = x.UserId,
                                            FirstName = x.User.FirstName,
                                            Email = x.User.Email,
                                            Location = x.Location,
                                            Active = x.JobPostings.Where(z => z.DateTo < DateTime.UtcNow).Count(),
                                            All = x.JobPostings.Count(),
                                            Photo = "foto"
                                        });
        }
    }
}
