using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IApplicationManager : IBaseManager
    {
        IEnumerable<ApplicationInfo> GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery);
    }
}
