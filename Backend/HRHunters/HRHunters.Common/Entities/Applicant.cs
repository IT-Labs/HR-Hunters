using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Applicant : User
    {
        public int Id { get; set; }
        [Phone]
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string Experience { get; set; }
        [Required]
        public string EducationType { get; set; }
        [Required]
        [RegularExpression("^[a-zA-Z0-9]*$", ErrorMessage = "Only Alphabets and Numbers allowed.")]
        public string SchoolUniversity { get; set; }
    }
}