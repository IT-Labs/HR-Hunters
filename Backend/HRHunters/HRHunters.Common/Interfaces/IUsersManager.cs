using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IUsersManager
    {
        Task<UserRegisterReturnModel> Register(UserRegisterModel userRegisterModel);
        Task<UserLoginReturnModel> Login(UserLoginModel userLoginModel);
    }
}
