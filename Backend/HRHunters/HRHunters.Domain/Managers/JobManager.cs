using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Domain.Managers
{
    public class JobManager : BaseManager, IJobManager
    {
        private readonly IRepository _repo;
        public JobManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }

        public IEnumerable<JobPosting> GetMultiple()
        {
           return _repo.GetAll<JobPosting>();
        }
    }
}
