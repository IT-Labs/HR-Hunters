using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
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
        public IEnumerable<ClientInfo> GetMultiple(int? pageSize, int? currentPage, string sortedBy, int sortDir, string filterBy)
        {
            var sortDirection = sortDir % 2 == 0 ? true : false;

            var _active = GetCount<Client>();




            return _repo.Get<Client>(orderBy: x => (!sortDirection) ? x.OrderBy(y => y.User.FirstName) : x.OrderByDescending(y => y.User.FirstName),
                includeProperties: $"{nameof(Client.User)}", skip: (currentPage - 1) * pageSize, take: pageSize)
                .Select(
                x => new ClientInfo
                {
                    Id = x.UserId,
                    FirstName = x.User.FirstName,
                    Email = x.User.Email,
                    Active = _active,
                    All = 7,
                    Photo = "Nati foto"
                });
        }
    }
}
