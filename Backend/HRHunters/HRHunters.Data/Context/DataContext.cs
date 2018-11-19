using HRHunters.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Data.Context
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        DbSet<Admin> Admins { get; set; }
        DbSet<Application> Applications { get; set; }
        DbSet<Applicant> Applicants { get; set; }
        DbSet<Client> Clients { get; set; }
        DbSet<JobPosting> JobPostings { get; set; }
        DbSet<User> Users { get; set; }
    }

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
