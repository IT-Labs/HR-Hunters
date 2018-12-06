using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public  interface IApplicantManager : IBaseManager
    {
        IEnumerable<ApplicantInfo> GetMultiple(QueryParams queryParams);
    }
}
