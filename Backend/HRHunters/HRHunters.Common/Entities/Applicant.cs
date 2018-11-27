using HRHunters.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Applicant : IEntity<int>
    {        
        [Required]
        public string Experience { get; set; }
        [Required]
        public string EducationType { get; set; }
        [Required]
        [RegularExpression("^[a-zA-Z0-9]*$", ErrorMessage = "Only Alphabets and Numbers allowed.")]
        public string SchoolUniversity { get; set; }
        public int UserId { get; set; }

        public User User { get; set; }
        public virtual ICollection<Application> Applications { get; set; }
        public int Id { get ; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set ; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }

        object IEntity.Id { get;}
    }
}