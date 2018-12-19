using HRHunters.Common.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Requests.Users
{
    public class UserRegisterModel
    {
        [Required, StringLength(25, ErrorMessage = "First name cannot be longer than 25 characters.")]
        [RegularExpression("^([a-zA-Z0-9]|[- @\\.#&!',_])*$", ErrorMessage = "First name can only contain alphanumeric characters and few special characters.")]
        public string FirstName { get; set; }
        [StringLength(25, ErrorMessage = "Last name cannot be longer than 25 characters.")]
        [RegularExpression("^[a-zA-Z]*$", ErrorMessage = "Last name can only contain letters.")]
        public string LastName { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(maximumLength: 20, ErrorMessage = "Password cannot contain more than 20 characters.")]
        [MinLength(8, ErrorMessage = "Password cannot be shorter than 8 characters.")]
        [RegularExpression("^[a-zA-Z0-9!@#$%^&*]*$", ErrorMessage = "The password can only contain alphanumeric characters and the special characters !@#$%^&*")]
        public string Password { get; set; }
        public UserType UserType { get; set; }
    }
}
