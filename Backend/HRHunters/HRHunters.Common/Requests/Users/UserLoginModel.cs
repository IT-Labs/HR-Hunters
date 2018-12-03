using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Requests.Users
{
    public class UserLoginModel
    {
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(maximumLength: 20, ErrorMessage = "Password cannot contain more than 20 characters.")]
        [MinLength(8, ErrorMessage = "Password cannot be shorter than 8 characters.")]
        public string Password { get; set; }
    }
}
