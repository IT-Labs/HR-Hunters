using HRHunters.Common.Entities;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public interface IJobManager : IBaseManager
    {
        IEnumerable<JobPosting> GetMultiple();
    }
}
