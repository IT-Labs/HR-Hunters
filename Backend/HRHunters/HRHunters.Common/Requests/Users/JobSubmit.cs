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
        [RequiredIf("ExistingCompany", true, errormessage: "Id is a required field.")]
        public int Id { get; set; }
        public bool ExistingCompany { get; set; }
        //Company info
        [RequiredIf("ExistingCompany", false, errormessage: "Company name is a required field.")]
        [StringLength(25, ErrorMessage = "Company name cannot be longer than 25 characters.")]
        public string CompanyName { get; set; }
        [RequiredIf("ExistingCompany", false, errormessage: "Email is a required field.")]
        [EmailAddress]
        public string Email { get; set; }
        [RequiredIf("ExistingCompany", false, errormessage: "Location is a required field.")]
        public string Location { get; set; }
        [RequiredIf("ExistingCompany", false, errormessage: "Logo is a required field.")]
        public string Logo { get; set; }
        [RequiredIf("ExistingCompany", false, errormessage: "Phone number is a required field.")]
        public string PhoneNumber { get; set; }
        [RequiredIf("ExistingCompany", false, errormessage: "Status is a required field.")]
        public string Status { get; set; }
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
