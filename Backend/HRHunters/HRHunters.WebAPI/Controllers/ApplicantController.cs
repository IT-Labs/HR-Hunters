using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Entities;
using HRHunters.Data;
using HRHunters.Data.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace HRHunters.WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicantController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        
        public ApplicantController(UserManager<User> userManager,SignInManager<User> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        /*public async IActionResult Login(UserForLoginDto userForLoginDto)
        {
            var user = await _userManager.FindByEmailAsync(userForLoginDto.Email);

            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);

            if(result.Succeeded)
            {
                var appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == userForLoginDto.Email);
                var userToReturn = 
            }
        }*/

    }
}