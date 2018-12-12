using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Requests;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public interface IClientManager : IBaseManager
    {
        ClientResponse GetMultiple(int pageSize = 0, int currentPage = 0, string sortedBy = "Id", SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "");
        ClientInfo UpdateClientStatus(int id, string status);
    }
}
