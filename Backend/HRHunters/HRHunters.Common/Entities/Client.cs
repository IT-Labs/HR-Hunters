using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Client : User
    {
        public int Id { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
    }
}