using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Requests.Admin
{
    public class JobUpdate
    {
        public int Id { get; set; }
        public string Status { get; set; }
        [Required]
        public string JobTitle { get; set; }
        [StringLength(800)]
        public string Description { get; set; }
        [Required]
        public string JobType { get; set; }
        [Required]
        public string Education { get; set; }
        [Required]
        public string Experience { get; set; }
        [Required]
        public string DateFrom { get; set; }
        [Required]
        public string DateTo { get; set; }
    }
}
