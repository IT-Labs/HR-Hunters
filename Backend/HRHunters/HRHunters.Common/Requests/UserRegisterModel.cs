using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Requests
{
    public class UserRegisterModel
    {
        public string CompanyName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
