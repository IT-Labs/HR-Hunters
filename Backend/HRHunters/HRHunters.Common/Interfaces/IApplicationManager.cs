using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Users;
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
        ApplicationResponse GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuer,int id);
        ApplicationInfo UpdateApplicationStatus(int id, string status);
        Task<object> CreateApplication(Apply apply,string currentUserId);
    }
}
