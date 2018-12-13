using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Application : Entity
    {
        public DateTime Date { get; set; }
        public ApplicationStatus Status { get; set; }
        public int ApplicantId { get; set; }
        public int JobPostingId { get; set; }
        public Applicant Applicant { get; set; }
        public JobPosting JobPosting { get; set; }
    }
}