using AutoMapper;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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
        public async Task<UserToReturnModel> Login(UserLoginModel userLoginModel)
        {
            var user = await _userManager.FindByEmailAsync(userLoginModel.Email);
            var userToReturn = new UserToReturnModel()
            {
                Succedeed = false
            };
            if (user == null)
            {
                return userToReturn;
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, userLoginModel.Password, false);
            if (result.Succeeded)
            {
                var appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == userLoginModel.Email);
                userToReturn = _mapper.Map<UserToReturnModel>(appUser);
                var roles = await _userManager.GetRolesAsync(appUser);
                userToReturn.Succedeed = true;
                userToReturn.Token = _extensionMethods.GenerateJwtToken(appUser);
                userToReturn.CompanyName = roles.Contains("Client") ? userToReturn.FirstName : null;
                userToReturn.Role = roles.Contains("Applicant") ? 0 : 1;
            }
            return userToReturn;

        }

        public async Task<IdentityResult> Register(UserRegisterModel userRegisterModel)
        {
            var userToCreate = _mapper.Map<User>(userRegisterModel);
            userToCreate.UserName = userToCreate.Email;
            var result = new IdentityResult();
            var role = userRegisterModel.UserType == UserType.APPLICANT ? "Applicant" : "Client";
            if (userRegisterModel.UserType == UserType.CLIENT)
            {
                userToCreate.FirstName = userRegisterModel.CompanyName;
            }
            result = await _userManager.CreateAsync(userToCreate, userRegisterModel.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(userToCreate, role);
            }

            return result;
        }
    }
}
