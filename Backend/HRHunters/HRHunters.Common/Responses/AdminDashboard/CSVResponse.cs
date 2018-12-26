using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class CSVResponse
    {
        public GeneralResponse Response { get; set; }
        public List<JobPosting> Jobs { get; set; }
    }
}
