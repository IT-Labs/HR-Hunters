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
        public bool ExistingCompany { get; set; }
        [RequiredIf("ExistingCompany", true, errormessage: "Id is a required field.")]
        public int Id { get; set; }
        //Company info
        [RequiredIf("ExistingCompany", false, errormessage: "Company name is a required field.")]
        [StringLength(25, ErrorMessage = "Company name cannot be longer than 25 characters.")]
        [MinLength(1, ErrorMessage = "Company name cannot be empty.")]
        public string CompanyName { get; set; }
        [RequiredIf("ExistingCompany", false, errormessage: "Email is a required field.")]
        [EmailAddress]
        public string CompanyEmail { get; set; }
        [MinLength(1, ErrorMessage = "Location cannot be empty.")]
        [RequiredIf("ExistingCompany", false, errormessage: "Location is a required field.")]
        public string CompanyLocation { get; set; }
        
        //Jobpost info
        [Required, RegularExpression("^[a-zA-Z ]*$", ErrorMessage = "Title can only contain alphabet characters.")]
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
