using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        [EmailAddress]
        [MaxLength(30)]
        public string Email { get; set; }
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}