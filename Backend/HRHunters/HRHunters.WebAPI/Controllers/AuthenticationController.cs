using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using HRHunters.Common.DTOs;
using HRHunters.Common.Entities;
using HRHunters.Data;
using HRHunters.Data.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HRHunters.WebAPI.Controllers
{
    //[Authorize]
    [Route("[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly RoleManager<Role> _roleManager;
        
        public AuthenticationController(IMapper mapper,RoleManager<Role> roleManager, 
            UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _mapper = mapper;
            _roleManager = roleManager;
        }

        [HttpPost("registerApplicant")]
        public async Task<IActionResult> RegisterApplicant(UserForRegisterDto userForRegisterDto)
        {
            var userToCreate = _mapper.Map<User>(userForRegisterDto);
            userToCreate.UserName = userToCreate.Email;
            var result = await _userManager.CreateAsync(userToCreate, userForRegisterDto.Password);
            var userToReturn = _mapper.Map<UserForRegisterDto>(userToCreate);
            await _userManager.AddToRoleAsync(userToCreate, "Applicant");
            if(result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result.Errors);
        }

        [HttpPost("registerClient")]
        public async Task<IActionResult> RegisterClient(ClientUserForRegisterDto clientUserForRegisterDto)
        {
            var userToCreate = _mapper.Map<User>(clientUserForRegisterDto);
            userToCreate.UserName = userToCreate.Email;
            var result = await _userManager.CreateAsync(userToCreate, clientUserForRegisterDto.Password);
            var userToReturn = _mapper.Map<UserForRegisterDto>(userToCreate);
            await _userManager.AddToRoleAsync(userToCreate, "Client");
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result.Errors);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var flag = false;
            var user = await _userManager.FindByEmailAsync(userForLoginDto.Email);
            if(user != null)
            {
                var roles = _userManager.GetRolesAsync(user);
                foreach(string role in roles.Result)
                {
                    if(role == userForLoginDto.Role.ToString())
                    {
                        flag = true;
                        break;
                    }
                }
                if (flag)
                {
                    var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);
                    if (result.Succeeded)
                    {
                        var appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == userForLoginDto.Email);
                        var userToReturn = _mapper.Map<UserForLoginDto>(appUser);

                        return Ok(new
                        {
                            result.Succeeded,
                            token = GenerateJwtToken(appUser),
                            user.Email,
                            user.Id,
                        });
                    }
                }
            }
            return  Unauthorized();
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

    }
}