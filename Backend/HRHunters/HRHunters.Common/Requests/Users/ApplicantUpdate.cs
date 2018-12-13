using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Requests.Users
{
    public class ApplicantUpdate
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required, Phone]
        public string PhoneNumber { get; set; }
        [Required]
        public string EducationType { get; set; }
        [Required]
        public string SchoolUniversity { get; set; }
        [Required]
        public string Experience { get; set; }
    }
}
