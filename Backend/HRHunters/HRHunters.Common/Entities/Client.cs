using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.Entities
{
    public class Client : User
    {
        public int UserId { get; set; }

        public User user { get; set; }
        public ICollection<JobPosting> JobPostings { get; set; }
    }
}