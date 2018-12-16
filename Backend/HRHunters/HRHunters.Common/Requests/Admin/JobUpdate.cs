using HRHunters.Common.CustomValidationAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Requests.Admin
{
    public class JobUpdate
    {
        public int Id { get; set; }
        public string Status { get; set; }
        [RequiredIf("Status", null, errormessage: "The JobTitle field is required")]
        public string JobTitle { get; set; }
        [StringLength(800)]
        public string Description { get; set; }
        [RequiredIf("Status", null, errormessage: "The JobType field is required")]
        public string JobType { get; set; }
        [RequiredIf("Status", null, errormessage: "The Education field is required")]
        public string Education { get; set; }
        [RequiredIf("Status", null, errormessage: "The Experience field is required")]
        public string Experience { get; set; }
        [RequiredIf("Status", null, errormessage: "The DateFrom field is required")]
        public string DateFrom { get; set; }
        [RequiredIf("Status", null, errormessage: "The DateTo field is required")]
        public string DateTo { get; set; }
    }
}
