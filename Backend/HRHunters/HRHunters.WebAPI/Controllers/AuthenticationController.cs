using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;

namespace HRHunters.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {

        private readonly IUsersManager _usersManager;

        public AuthenticationController(IUsersManager usersManager)
        {
            _usersManager = usersManager;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterModel userRegisterModel)
        {
            var result = await _usersManager.Register(userRegisterModel);
            if (!result.Succeeded)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("login")]
        
        public async Task<IActionResult> Login(UserLoginModel userLoginModel)
        {
            var user = await _usersManager.Login(userLoginModel);
            if (!user.Succeeded)
            {
                return BadRequest(user);
            }
            return Ok(user);

        }

    }
}