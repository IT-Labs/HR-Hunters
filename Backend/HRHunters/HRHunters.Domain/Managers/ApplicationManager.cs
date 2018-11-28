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
        public IEnumerable<Application> GetAllApplications()
        {
            return _repo.GetAll<Application>();
        }
        
    }
}
