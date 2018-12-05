using HRHunters.Common.Entities;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public interface IJobManager : IBaseManager
    {
        IEnumerable<JobInfo> GetMultiple(int? pageSize, int? currentPage, string sortedBy, int sortDir, string filterBy);
    }
}
