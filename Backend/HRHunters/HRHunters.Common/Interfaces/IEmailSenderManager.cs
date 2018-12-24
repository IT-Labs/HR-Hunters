using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IEmailSenderManager
    {
        Task SendEmail(User user);
        Task SendEmail(Applicant applicant, JobPosting jobPosting);
    }
}
