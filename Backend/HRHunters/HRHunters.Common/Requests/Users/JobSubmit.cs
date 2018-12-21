using HRHunters.Common.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using HRHunters.Common.CustomValidationAttributes;

namespace HRHunters.Common.Requests.Users
{
    public class JobSubmit
    {
        [Required]
        public int Id { get; set; }
        //Jobpost info
        [Required]
        public string Title { get; set; }
        [StringLength(800)]
        public string Description { get; set; }
        [Required]
        public string EmpCategory { get; set; }
        [Required]
        public string Education { get; set; }
        [Required]
        public string NeededExperience { get; set; }
        [Required]
        public string DateFrom { get; set; }
        [Required]
        public string DateTo { get; set; }
    }
}
