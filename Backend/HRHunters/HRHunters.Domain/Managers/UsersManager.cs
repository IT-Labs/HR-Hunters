using AutoMapper;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.ModelBinding;

namespace HRHunters.Domain.Managers
{
    public class UsersManager : IUsersManager
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly SignInManager<User> _signInManager;
        private readonly IExtensionMethods _extensionMethods;
        public UsersManager(UserManager<User> userManager, IMapper mapper, SignInManager<User> signInManager, IExtensionMethods extensionMethods)
        {
            _extensionMethods = extensionMethods;
            _userManager = userManager;
            _mapper = mapper;
            _signInManager = signInManager;
        }
        public async Task<JsonResult> Login(UserLoginModel userLoginModel)
        {
            var user = await _userManager.FindByEmailAsync(userLoginModel.Email);
            if (user != null)
            {
                var result = await _signInManager.CheckPasswordSignInAsync(user, userLoginModel.Password, false);
                if (result.Succeeded)
                {
                    var appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == userLoginModel.Email);
                    var userToReturn = _mapper.Map<UserLoginModel>(appUser);
                    var roles = _userManager.GetRolesAsync(appUser);
                    var role = roles.Result;
                    return new JsonResult(new {
                        result.Succeeded,
                        token = _extensionMethods.GenerateJwtToken(appUser),
                        user.Email,
                        user.Id,
                        role
                    });
                }
            }
            return new JsonResult(new
            {
                error = "Unauthorized"
            });
        }

        public async Task<IdentityResult> Register(UserRegisterModel userRegisterModel)
        {
            var userToCreate = _mapper.Map<User>(userRegisterModel);
            userToCreate.UserName = userToCreate.Email;
            var result = new IdentityResult();
            if (userRegisterModel.UserType==0)
            {
                result = await _userManager.CreateAsync(userToCreate, userRegisterModel.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(userToCreate, "Applicant");
                }
                return result;
            }
            else if((int)userRegisterModel.UserType == 1)
            {
                userToCreate.FirstName = userRegisterModel.CompanyName;
                result = await _userManager.CreateAsync(userToCreate, userRegisterModel.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(userToCreate, "Client");
                }
                return result;
            }
            return result;
        }
    }
}
