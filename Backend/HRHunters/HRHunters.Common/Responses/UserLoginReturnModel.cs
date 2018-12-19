using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses
{
    public class UserLoginReturnModel
    {
        public bool Succeeded { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Token { get; set; }
        public string Email { get; set; }
        public int Id { get; set; }
        public int Role { get; set; }
        public IDictionary<string, List<string>> Errors { get; set; }

        public UserLoginReturnModel()
        {
            Succeeded = false;
            Errors = new Dictionary<string, List<string>>()
            {
                {"Error", new List<string>() }
            };
        }
        public UserLoginReturnModel(ModelStateDictionary modelState)
        {
            Errors = new Dictionary<string, List<string>>()
            {
                {
                    "Error", new List<string>() { "Invalid email or password" }
                }
            };
        }
    }
}
