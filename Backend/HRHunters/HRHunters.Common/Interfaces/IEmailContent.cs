using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IEmailContent
    {
        Task<string> NewUserContent(User user);
        string NewApplicationContent(Applicant applicant, JobPosting jobPosting);
    }
}
