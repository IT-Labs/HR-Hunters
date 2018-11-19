using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Application
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public int ApplicantId { get; set; }
        public int JobId { get; set; }

        public Applicant Applicant { get; set; }
        public JobPosting JobPosting { get; set; }
    }
}