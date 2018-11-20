using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using HRHunters.Data.Context;
using HRHunters.Common.Entities;
using Microsoft.EntityFrameworkCore.Design;

namespace HRHunters.Data.Context
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
  
        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Applicant> Apllicants { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<JobPosting> JobPostings { get; set; }
        public DbSet<User> Users{ get; set; }

        public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
        {
            public DataContext CreateDbContext(string[] args)
            {
                var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
                optionsBuilder.UseNpgsql("Server=192.168.5.241;Port=5432;Username=hrhunters;Password=DD1P5Ua6cljJLPLts2my;Database=HR-Hunters;");

                return new DataContext(optionsBuilder.Options);
            }
        }
    }
}
