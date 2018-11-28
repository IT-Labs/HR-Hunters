using HRHunters.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Role : IdentityRole<int>, IEntity
    {
        public ICollection<UserRole> UserRoles { get; set; }
        private DateTime? createdDate;

        [DataType(DataType.DateTime)]
        public DateTime CreatedDate
        {
            get { return createdDate ?? DateTime.UtcNow; }
            set => createdDate = value;
        }

        [DataType(DataType.DateTime)]
        public DateTime? ModifiedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }

    }
}
