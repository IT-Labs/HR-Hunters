using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class ApplicantInfo
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Photo { get; set; }
        public string Email { get; set; }
        public string Education { get; set; }
        public string School { get; set; }
        public string Experience { get; set; }
    }
}
