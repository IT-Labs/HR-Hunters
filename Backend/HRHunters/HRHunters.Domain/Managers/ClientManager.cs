﻿using System;
using System.Collections.Generic;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
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
        public IEnumerable<Client> GetMultiple()
        {
            return _repo.GetAll<Client>();
        }
    }
}
