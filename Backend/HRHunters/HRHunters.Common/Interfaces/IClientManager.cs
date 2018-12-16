using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IClientManager : IBaseManager
    {
        ClientResponse GetMultiple(int pageSize,int currentPage,string sortedBy,SortDirection sortDir,string filterBy,string filterQuery);
        GeneralResponse UpdateClientStatus(ClientStatusUpdate clientStatusUpdate);
        Task<GeneralResponse> UpdateClientProfile(int id, ClientUpdate clientUpdate);
        Task<GeneralResponse> CreateCompany(NewCompany newCompany);
    }
}
