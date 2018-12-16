using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class ApplicantResponse
    {
        public List<ApplicantInfo> Applicants { get; set; }
        public int MaxApplicants { get; set; }
    }
}
