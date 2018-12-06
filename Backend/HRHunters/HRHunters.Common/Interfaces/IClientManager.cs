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
    public interface IClientManager : IBaseManager
    {
        IEnumerable<ClientInfo> GetMultiple(QueryParams queryParams,ClientStatus filterBy);
    }
}
