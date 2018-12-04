using HRHunters.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class ClientInfo
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string Photo { get; set; }
        public string Email { get; set; }
        public int Active { get; set; }
        public int All { get; set; }
        public ClientStatus Status { get; set; }
    }
}
