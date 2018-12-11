using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public interface IClientManager : IBaseManager
    {
        ClientResponse GetMultiple(int pageSize, int currentPage, 
            string sortedBy, SortDirection sortDir, string filterBy, string filterQuery);
        ClientResponse GetMultiple();
        ClientInfo UpdateClientStatus(int id, string status);
    }
}
