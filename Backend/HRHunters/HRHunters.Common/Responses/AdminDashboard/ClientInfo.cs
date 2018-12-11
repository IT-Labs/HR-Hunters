using HRHunters.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class ClientInfo
    {
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string Logo { get; set; }
        public string Email { get; set; }
        public string Location { get; set; }
        public int ActiveJobs { get; set; }
        public int AllJobs { get; set; }
        public string Status { get; set; }
    }
}
