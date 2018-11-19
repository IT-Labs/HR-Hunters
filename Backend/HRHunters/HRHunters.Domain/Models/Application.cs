using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace HRHunters.Domain.Models
{
    public class Application
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public int ApplicantId { get; set; }
        public int JobId { get; set; }
    }
}
