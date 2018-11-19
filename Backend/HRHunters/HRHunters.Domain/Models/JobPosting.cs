using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Domain.Models
{
    class JobPosting
    {
        public int Id { get; set; }
        [Required]
        [RegularExpression("^[a-zA-Z0-9]*$", ErrorMessage = "Only alphabet letters are allowed.")]
        public string Title { get; set; }
        [Required]
        public DateTime DateFrom { get; set; }
        [Required]
        public DateTime DateTo { get; set; }
        [Required]
        public string Location { get; set; }
        [StringLength(800)]
        public string Description { get; set; }
        [Required]
        public string EmpCategory { get; set; }
        [Required]
        public string Education { get; set; }
        public string Status { get; set; }
        [Required]
        public string NeededExperience { get; set; }
        public int ClientId { get; set; }

    }
}
