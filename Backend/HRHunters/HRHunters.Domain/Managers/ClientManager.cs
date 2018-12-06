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
    public class ClientManager : BaseManager, IClientManager
    {
        private readonly IRepository _repo;
        public ClientManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }
        public IEnumerable<ClientInfo> GetMultiple(QueryParams queryParams, ClientStatus filterBy)
        {
            var sortDirection = queryParams.SortDir.Equals(SortDirection.ASC) ? true : false;

            return _repo.Get<Client>(orderBy: queryParams.SortedBy,
                                     includeProperties: $"{nameof(Client.User)}," + $"{nameof(Client.JobPostings)}",
                                     skip: (queryParams.CurrentPage - 1) * queryParams.PageSize,
                                     take: queryParams.PageSize,
                                     sortDirection: queryParams.SortDir)
                                     .Select(x => new ClientInfo
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
