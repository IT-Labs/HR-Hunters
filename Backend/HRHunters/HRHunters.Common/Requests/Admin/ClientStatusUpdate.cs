using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Requests.Admin
{
    public class ClientStatusUpdate
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Status { get; set; }
    }
}
