using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HRHunters.Data.Context
{
    public class SeedData
    {
        private readonly DataContext _repo;
        public SeedData(DataContext repo)
        {
            _repo = repo;
        }

        public void EnsureSeedData()
        {
            if (!_repo.Users.Any()) { 
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
                _repo.Add<User>(entry);
            }

            
            _repo.SaveChanges();
        }
    }


}
