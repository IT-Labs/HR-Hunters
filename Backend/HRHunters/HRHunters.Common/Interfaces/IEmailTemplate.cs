using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IEmailTemplate
    {
        Task<string> NewUserTemplate(User user);
        string NewApplicantAppliedTemplate(Applicant applicant, JobPosting jobPosting);
    }
}
