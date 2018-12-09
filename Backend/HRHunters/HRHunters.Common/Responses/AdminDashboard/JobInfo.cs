using HRHunters.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class JobInfo
    {
        public int Id { get; set; }
        public string JobTitle { get; set; }
        public string CompanyName { get; set; }
        public string CompanyEmail { get; set; }
        public string Location { get; set; }
        public string JobType { get; set; }
        public string DateTo { get; set; }
        public int AllApplicationsCount { get; set; }
        public string Status { get; set; }
    }
}
