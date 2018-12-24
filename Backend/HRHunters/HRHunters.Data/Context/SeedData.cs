using HRHunters.Common.Constants;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
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

        public SeedData(IClientManager clientManager,IApplicationManager applicationManager, IApplicantManager applicantManager, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _clientManager = clientManager;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public void EnsureSeedData()
        {
            if (!_roleManager.Roles.Any())
            {
                var roles = new List<Role>
                {
                    new Role { Name = "Applicant" },
                    new Role { Name = "Client" },
                    new Role { Name = "Admin" }
                };
                foreach (var role in roles)
                {
                    _roleManager.CreateAsync(role).Wait();
                }
                
            }

            Random random = new Random();

            if (!_userManager.Users.Any())
            { 
            for(int i = 0; i < 90; i++)
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
                    Array values = Enum.GetValues(typeof(ClientStatus));

                    if (i % 2 == 0)
                    {
                        var client = new Client()
                        {
                            User = user,
                            Location = "Skopje",
                            PhoneNumber = "+3891112344",
                            Status = (ClientStatus)values.GetValue(random.Next(values.Length)),
                            Logo = EnvironmentVariables.CLOUD_FRONT_URL + "6780f660-95fe-47da-8beb-88639bcace3c.JPEG"
                        };
                        _clientManager.Create(client);
                        _userManager.AddToRoleAsync(user, "Client").Wait();
                        values = Enum.GetValues(typeof(JobPostingStatus));
                        var jobPost = new JobPosting()
                        {
                            Client = client,
                            DateFrom = DateTime.UtcNow,
                            DateTo = DateTime.UtcNow.AddDays(4),
                            Title = "Backend developer" + i,
                            Education = EducationType.Bachelor,
                            Description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the" +
                            " industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it " +
                            "to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, " +
                            "remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem " +
                            "Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                            EmpCategory = JobType.Full_time,
                            Status = (JobPostingStatus)values.GetValue(random.Next(values.Length)),
                            NeededExperience = "3",
                        };
                        _clientManager.Create(jobPost, "Admin");
                    }
                    else
                    {
                        var applicant = new Applicant()
                        {
                            User = user,
                            SchoolUniversity = "school" + i,
                            EducationType = EducationType.Bachelor,
                            PhoneNumber = "+38931453312",
                            Experience = "3",
                            Logo = EnvironmentVariables.CLOUD_FRONT_URL + "6780f660-95fe-47da-8beb-88639bcace3c.JPEG"
                        };

                        _clientManager.Create(applicant, "Admin");
                        _userManager.AddToRoleAsync(user, "Applicant").Wait();
                        values = Enum.GetValues(typeof(ApplicationStatus));
                        var application = new Application()
                        {
                            Applicant = applicant,
                            Date = DateTime.UtcNow,
                            JobPosting = _clientManager.GetOne<JobPosting>(filter: x => x.ClientId == i),
                            Status = (ApplicationStatus)values.GetValue(random.Next(values.Length)),                            
                        };
                        _clientManager.Create(application, "Admin");
                    }
                }
            }
            

        }
    }


}
