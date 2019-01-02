using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
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
        Task<ApplicationResponse> GetMultiple(SearchRequest request);
        GeneralResponse UpdateApplicationStatus(int id, StatusUpdate statusUpdate);
        Task<GeneralResponse> CreateApplication(Apply apply);
        ApplicationInfo GetOneApplication(int id);
    }
}
