using HRHunters.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Requests.Users
{
    public class JobSubmit
    {
        public string CompanyName { get; set; }
        public string ContactEmail { get; set; }
        public string Location { get; set; }
        public string PositionTitle { get; set; }
        public string Description { get; set; }
        public JobType JobType { get; set; }
        public EducationType Education { get; set; }
        public string Experience { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
    }
}
