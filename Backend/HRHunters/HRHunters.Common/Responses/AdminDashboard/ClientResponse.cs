using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Responses.AdminDashboard
{
    public class ClientResponse
    {
        public List<ClientInfo> Clients { get; set; }
        public int MaxClients { get; set; }
        public int Active { get; set; }
        public int Inactive { get; set; }
    }
}
