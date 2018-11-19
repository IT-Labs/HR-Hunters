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
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
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
                optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=test;User Id=postgres;Password=;");

                return new DataContext(optionsBuilder.Options);
            }
        }
    }
}
