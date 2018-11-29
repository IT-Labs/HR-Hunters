using HRHunters.Common.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses
{
    public class UserToReturnModel
    {
        public bool Succedeed { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public string Token { get; set; }
        public string Email { get; set; }
        public int Id { get; set; }
        public int Role { get; set; }
    }
}
