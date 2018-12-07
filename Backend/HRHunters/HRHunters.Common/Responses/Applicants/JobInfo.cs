using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.Applicants
{
    class JobInfo
    {
        public string PositionTitle { get; set; }
        public string CompanyName { get; set; }
        public string ContactEmail { get; set; }
        public string Location { get; set; }
        public string JobType { get; set; }
        public string Expires { get; set; }
        public int Applications { get; set; }
        public string Status { get; set; }
    }
}
