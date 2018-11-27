using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Data;
using HRHunters.Data.Context;

namespace HRHunters.Domain.Managers
{
    public class ApplicantManager : BaseManager<Applicant>, IApplicantManager
    {
        private readonly IRepository _repo;
        public ApplicantManager(IRepository repo) : base (repo)
        {
            _repo = repo;
        }

        public IEnumerable<Applicant> GetAllApplicants()
        {
            throw new NotImplementedException();
        }
    }
}
