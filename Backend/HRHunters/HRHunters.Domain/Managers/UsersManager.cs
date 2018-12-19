using AutoMapper;
using HRHunters.Common.Constants;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRHunters.Domain.Managers
{
    public class UsersManager : IUsersManager
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenGeneration _tokenGeneration;
        private readonly IClientManager _clientManager;
        private readonly IApplicantManager _applicantManager;
        public UsersManager(UserManager<User> userManager, IMapper mapper, 
            SignInManager<User> signInManager, ITokenGeneration tokenGeneration, IClientManager clientManager, IApplicantManager applicantManager)
        {
            _clientManager = clientManager;
            _applicantManager = applicantManager;
            _tokenGeneration = tokenGeneration;
            _userManager = userManager;
            _mapper = mapper;
            _signInManager = signInManager;
        }
        public async Task<UserLoginReturnModel> Login(UserLoginModel userLoginModel)
        {
            var user = await _userManager.FindByEmailAsync(userLoginModel.Email.ToLower());

            var userToReturn = new UserLoginReturnModel();
            //User not found by email
            if (user == null)
            {
                userToReturn.Errors["Error"].Add("Invalid email or password.");
                return userToReturn;
            }
            //If user exists, check password
            var result = await _signInManager.CheckPasswordSignInAsync(user, userLoginModel.Password, false);
            if (!result.Succeeded)
            {
                //Wrong password, return error
                userToReturn.Errors["Error"].Add("Invalid email or password.");
                return userToReturn;
            }
            //If OK generate token
            var appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == userLoginModel.Email.ToLower());
            userToReturn = _mapper.Map<UserLoginReturnModel>(appUser);
            var roles = await _userManager.GetRolesAsync(appUser);

            userToReturn.Succeeded = true;
            userToReturn.Token = await _tokenGeneration.GenerateJwtToken(user);
            userToReturn.Role = roles.Contains(RoleConstants.APPLICANT) ? 1 : roles.Contains(RoleConstants.CLIENT) ? 2 : 3 ;
            return userToReturn;
        }

        public async Task<GeneralResponse> Register(UserRegisterModel userRegisterModel)
        {
            var userToCreate = _mapper.Map<User>(userRegisterModel);
            userToCreate.UserName = userToCreate.Email.ToLower();
            var role = userRegisterModel.UserType == UserType.APPLICANT ? RoleConstants.APPLICANT : RoleConstants.CLIENT;
            var userToReturn = new GeneralResponse();

            if (string.IsNullOrEmpty(userRegisterModel.LastName) && role==RoleConstants.APPLICANT)
            {
                userToReturn.Errors["Error"].Add("Last name is required");
                return userToReturn;
            }
            var result = await _userManager.CreateAsync(userToCreate, userRegisterModel.Password);
           
            if (!result.Succeeded)
            {
                var list = new List<string>();
                foreach(var error in result.Errors)
                {
                    list.Add(error.Description);
                }
                userToReturn.Errors["Error"].AddRange(list);
                return userToReturn;
            }
            if (role == RoleConstants.CLIENT)
            {
                userToCreate.LastName = null;
            }

            if(role.Equals(RoleConstants.APPLICANT))
                _applicantManager.Create(new Applicant() { User = userToCreate });
            else
                _clientManager.Create(new Client() { User = userToCreate });

            await _userManager.AddToRoleAsync(userToCreate, role);
            userToReturn.Succeeded = true;
            return userToReturn;
        }

    }
}
