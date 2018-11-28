using HRHunters.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Application : Entity<int>
    {
        public DateTime Date { get; set; }
        [DisplayName("Status")]
        public string Status { get; set; }
        public int ApplicantId { get; set; }
        public int JobId { get; set; }

        public Applicant Applicant { get; set; }
        public JobPosting JobPosting { get; set; }

    }
}