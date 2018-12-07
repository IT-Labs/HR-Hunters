using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public  interface IApplicantManager : IBaseManager
    {
        IEnumerable<ApplicantInfo> GetMultiple(int currentPage, int pageSize, string sortedBy, SortDirection sortDir,string filterBy, string filterQuery);
    }
}
