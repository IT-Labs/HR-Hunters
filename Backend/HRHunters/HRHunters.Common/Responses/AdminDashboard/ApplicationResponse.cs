using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class ApplicationResponse
    {
        public List<ApplicationInfo> Applications { get; set; }
        public int MaxApplications { get; set; }
        public int Pending { get; set; }
        public int Contacted { get; set; }
        public int Interviewed { get; set; }
        public int Hired { get; set; }
        public int Rejected { get; set; }
    }
}
