using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Domain.Managers;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HRHunters.Data.Context
{
    public class SeedData
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IClientManager _clientManager;
        private readonly IApplicantManager _applicantManager;
        private readonly IApplicationManager _applicationManager;

        public SeedData(IClientManager clientManager,IApplicationManager applicationManager, IApplicantManager applicantManager, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _applicantManager = applicantManager;
            _applicationManager = applicationManager;
            _clientManager = clientManager;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public void EnsureSeedData()
        {
            if (!_userManager.Users.Any())
            { 
            for(int i = 0; i < 10; i++)
                {
                    var user = new User();
                    user.Email = "vlatkozmejkoski" + i + "@gmail.com";
                    user.EmailConfirmed = true;
                    user.NormalizedEmail = user.Email.ToUpper();
                    user.SecurityStamp = Guid.NewGuid().ToString("D");
                    user.LockoutEnabled = false;
                    user.FirstName = "Vlatko" + i;
                    user.LastName = "Zmejkoski" + i;
                    user.UserName = user.FirstName.ToLower() + user.LastName.ToLower();
                    user.PhoneNumber = "078691342";
                    user.AccessFailedCount = 0;
                    user.CreatedBy = user.FirstName;

                    _userManager.CreateAsync(user, "Password").Wait();

                    if (i % 2 == 0)
                    {
                        var client = new Client()
                        {
                            User = user,
                        };
                        _clientManager.Create(client);
                        var jobPost = new JobPosting()
                        {
                            Client = client,
                            DateFrom = DateTime.UtcNow,
                            DateTo = DateTime.UtcNow.AddDays(4),
                            Title = "Backend developer" + i,
                            Education = "Bachelor degree",
                            Description = "Lorem ipsum bruh...",
                            EmpCategory = "Full-time",
                            Location = "Skopje, Macedonia",
                            Status = 0,
                        };

                    }
                    else
                    {
                        var applicant = new Applicant()
                        {
                            User = user,
                            SchoolUniversity = "school" + i,
                            EducationType = "B"
                        };
                        _applicantManager.Create(applicant);
                        var application = new Application()
                        {
                            Applicant = applicant,
                            Date = DateTime.UtcNow,
                            JobPosting = _clientManager.GetById<Client>(i).JobPostings.FirstOrDefault(),
                        };
                        _applicationManager.Create(application);
                    }
                }
            }
            if(!_roleManager.Roles.Any())
            {
                var roles = new List<Role>
                {
                    new Role { Name = "Applicant" },
                    new Role { Name = "Client" },
                    new Role { Name = "Admin" }
                };
                foreach(var role in roles)
                {
                    _roleManager.CreateAsync(role).Wait();
                }
                
            }

        }
    }


}
