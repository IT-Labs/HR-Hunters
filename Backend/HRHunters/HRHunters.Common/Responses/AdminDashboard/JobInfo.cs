using HRHunters.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class JobInfo
    {
        public int Id { get; set; }
        public string PositionTitle { get; set; }
        public string CompanyName { get; set; }
        public string ContactEmail { get; set; }
        public string Location { get; set; }
        public JobType JobType { get; set; }
        public string Expires { get; set; }
        public int Applications { get; set; }
        public string Status { get; set; }
    }
}
