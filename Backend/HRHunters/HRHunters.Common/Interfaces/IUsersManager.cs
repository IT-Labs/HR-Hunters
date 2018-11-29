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
        Task<IdentityResult> Register(UserRegisterModel userRegisterModel);
        Task<UserToReturnModel> Login(UserLoginModel userLoginModel);
    }
}
