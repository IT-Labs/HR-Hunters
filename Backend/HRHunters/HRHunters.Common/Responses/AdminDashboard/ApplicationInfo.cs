using HRHunters.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class ApplicationInfo
    {
        public string ApplicantName { get; set; }
        public string ApplicantEmail { get; set; }
        public string JobTitle { get; set; }
        public string Experience { get; set; }
        public string Posted { get; set; }
        public string Status { get; set; }
    }
}
