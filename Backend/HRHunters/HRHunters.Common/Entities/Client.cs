using HRHunters.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Client : Entity
    {
        public int UserId { get; set; }

        public User User { get; set; }
        public ICollection<JobPosting> JobPostings { get; set; }
        public string PhoneNumber { get; set; }
    }
}