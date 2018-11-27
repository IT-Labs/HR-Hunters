using System;
using System.Collections.Generic;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Data;

namespace HRHunters.Domain.Managers
{
    public class ClientManager : BaseManager<Client>, IClientManager
    {
        private readonly IRepository _repo;
        public ClientManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }
        public IEnumerable<Client> GetAllClients()
        {
            return _repo.Get<Client>(filter: x => x.Id == x.User.Id);
        }
    }
}
