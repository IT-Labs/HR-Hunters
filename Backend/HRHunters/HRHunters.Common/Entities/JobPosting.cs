using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class JobPosting : Entity
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public DateTime DateFrom { get; set; }
        [Required]
        public DateTime DateTo { get; set; }
        [StringLength(800)]
        public string Description { get; set; }
        [Required]
        public JobType EmpCategory { get; set; }
        [Required]
        public EducationType Education { get; set; }
        public JobPostingStatus Status { get; set; }
        [Required]
        public string NeededExperience { get; set; }
        public int ClientId { get; set; }

        public Client Client { get; set; }
        public ICollection<Application> Applications { get; set; }
    }
}