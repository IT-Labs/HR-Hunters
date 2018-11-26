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
        private readonly RoleManager<Role> _roleManager;
        public SeedData(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public void EnsureSeedData()
        {
            if (!_userManager.Users.Any())
            { 
            for(int i = 0; i < 10; i++)
                {
                    var user = new User();
                    //var pass = new PasswordHasher<User>();
                    //var hashedPass = pass.HashPassword(user, "password12");
                    user.Email = "vlatkozmejkoski" + i + "@gmail.com";
                    user.EmailConfirmed = true;
                    user.NormalizedEmail = user.Email.ToUpper();
                    user.NormalizedUserName = user.UserName.ToUpper();
                    user.SecurityStamp = Guid.NewGuid().ToString("D");
                    user.LockoutEnabled = false;
                    user.FirstName = "Vlatko" + i;
                    user.LastName = "Zmejkoski" + i;
                    user.UserName = user.FirstName.ToLower() + user.LastName.ToLower();
                    //user.PasswordHash = "";
                    user.PhoneNumber = "078691342";
                    user.AccessFailedCount = 0;
                    user.CreatedBy = user.FirstName;

                    _userManager.CreateAsync(user, "Password").Wait();
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
            var userce = _userManager.FindByEmailAsync("zmejkoski@gmail.com");
            _userManager.AddToRoleAsync(userce.Result, "Admin").Wait();
        }
    }


}
