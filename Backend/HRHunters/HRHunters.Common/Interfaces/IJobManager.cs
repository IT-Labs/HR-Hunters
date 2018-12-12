using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IJobManager : IBaseManager
    {
        Task<JobResponse> GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery, int id);
        Task<object> CreateJobPosting(JobSubmit jobSubmit);
        JobInfo GetOneJobPosting(int id);
        GeneralResponse UpdateJob(JobUpdate jobSubmit);

    }
}
