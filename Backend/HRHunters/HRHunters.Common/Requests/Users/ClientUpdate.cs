using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Requests.Users
{
    public class ClientUpdate
    {
        [Required]
        public int UserId { get; set; }
        [Required, StringLength(25, ErrorMessage = "Company name cannot be longer than 25 characters.")]
        public string CompanyName { get; set; }
        [Required, EmailAddress]
        public string CompanyEmail { get; set; }
        [Required]
        public string Location { get; set; }
        [Required, Phone]
        public string PhoneNumber { get; set; }
    }
}
