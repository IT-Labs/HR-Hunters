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
        IEnumerable<ClientInfo> GetMultiple(int? currentPage, int? pageSize, string sortedBy, SortDirection sortDir, ClientStatus filterBy);
    }
}
