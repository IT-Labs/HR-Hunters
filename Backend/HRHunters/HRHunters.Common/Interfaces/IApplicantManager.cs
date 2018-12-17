using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Requests;
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
    public  interface IApplicantManager : IBaseManager
    {
        ApplicantResponse GetMultiple(SearchRequest request);
        Task<GeneralResponse> UpdateApplicantProfile(int id, ApplicantUpdate applicantUpdate, int currentUserId);
    }
}
