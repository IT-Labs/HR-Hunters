using HRHunters.Common.Entities;
using HRHunters.Common.Responses;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IEmailSenderManager
    {
        Task<GeneralResponse> SendEmail(User user);
        Task<GeneralResponse> SendEmail(Applicant applicant, JobPosting jobPosting);
    }
}
