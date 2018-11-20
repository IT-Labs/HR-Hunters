using HRHunters.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Admin : IEntity<int>
    {
        public int UserId { get; set; }
        public User User { get; set; }


        public int Id { get => ((IEntity<int>)User).Id; set => ((IEntity<int>)User).Id = value; }
        public DateTime CreatedDate { get => ((IEntity<int>)User).CreatedDate; set => ((IEntity<int>)User).CreatedDate = value; }
        public DateTime? ModifiedDate { get => ((IEntity<int>)User).ModifiedDate; set => ((IEntity<int>)User).ModifiedDate = value; }
        public string CreatedBy { get => ((IEntity<int>)User).CreatedBy; set => ((IEntity<int>)User).CreatedBy = value; }
        public string ModifiedBy { get => ((IEntity<int>)User).ModifiedBy; set => ((IEntity<int>)User).ModifiedBy = value; }

        object IEntity.Id => ((IEntity<int>)User).Id;
    }
}