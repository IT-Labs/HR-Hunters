using HRHunters.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Applicant : Entity
    {        
        public string Experience { get; set; }
        public string EducationType { get; set; }
        [Required]
        [RegularExpression("^[a-zA-Z0-9]*$", ErrorMessage = "Only Alphabets and Numbers allowed.")]
        public string SchoolUniversity { get; set; }
        public int UserId { get; set; }
        public string PhoneNumber { get; set; }
        public new int Id { get { return UserId; } set { Id = value; } }
        [DisplayName("User")]
        public User User { get; set; }
        public virtual ICollection<Application> Applications { get; set; }
    }
}