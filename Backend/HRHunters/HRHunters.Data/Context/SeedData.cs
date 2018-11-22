using HRHunters.Common.Entities;
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
        public SeedData(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public void EnsureSeedData()
        {
            if (!_userManager.Users.Any())
            { 
            var entry = new User()
            {
                
                UserName = "vlatkozmejkoski",
                NormalizedUserName = "vlatkozmejkoski",
                NormalizedEmail = "vlatkozmejkoski@gmail.com",
                PasswordHash = "5f4dcc3b5aa765d61d8327deb882cf99",
                SecurityStamp = "asdasdas-das-dasdad-asdasd",
                PhoneNumber = "078691342",
                PhoneNumberConfirmed = true,
                TwoFactorEnabled = false,
                LockoutEnabled = true,
                AccessFailedCount = 0,
                Email = "vlatkozmejkoski@gmail.com",
                CreatedDate = DateTime.UtcNow,
                CreatedBy = "Vlatko",
                FirstName = "Vlatko",
                LastName = "Zmejkoski"                
            };

                _userManager.CreateAsync(entry, "password").Wait();
            }
        }
    }


}
