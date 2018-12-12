using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class JobResponse
    {
        public List<JobInfo> JobPostings { get; set; }
        public int MaxJobPosts { get; set; }
        public int Approved { get; set; }
        public int Pending { get; set; }
        public int Rejected { get; set; }
        public int Expired { get; set; }
    }
}
