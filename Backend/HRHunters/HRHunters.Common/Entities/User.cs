using HRHunters.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class User : IdentityUser<int>, IEntity<int>
    {
        [Required]
        [EmailAddress]
        [MaxLength(30)]
        public override string Email { get; set; }
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }
        public string LastName { get; set; }


        private DateTime? createdDate;

        [DataType(DataType.DateTime)]
        public DateTime CreatedDate {
            get { return createdDate ?? DateTime.UtcNow;  }
            set => createdDate = value; }

        [DataType(DataType.DateTime)]
        public DateTime? ModifiedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }

        object IEntity.Id
        {
            get { return Id; }
        }

        public ICollection<UserRole> UserRoles { get; set; }

      
    }
}