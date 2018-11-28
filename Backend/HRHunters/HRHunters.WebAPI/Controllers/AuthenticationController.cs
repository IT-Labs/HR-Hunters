using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using HRHunters.Common.DTOs;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
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
        private readonly IApplicantManager _applicantManager;
        
        public AuthenticationController(IMapper mapper,RoleManager<Role> roleManager, 
            UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration, IApplicantManager applicantManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _mapper = mapper;
            _roleManager = roleManager;
            _applicantManager = applicantManager;
        }

        //[HttpPut("/")]

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterModel modelRegister)
        {
            if (ModelState.IsValid) {
                if (modelRegister.CompanyName == null)
                {
                    var userToCreate = _mapper.Map<User>(modelRegister);
                    userToCreate.UserName = userToCreate.Email;
                    var result = await _userManager.CreateAsync(userToCreate, modelRegister.Password);
                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(userToCreate, "Applicant");
                        return Ok(result);
                    }else
                    {
                        return BadRequest(result.Errors);
                    }

                }else if(modelRegister.FirstName == null && modelRegister.LastName == null)
                {
                    var userToCreate = _mapper.Map<User>(modelRegister);
                    userToCreate.UserName = userToCreate.Email;
                    userToCreate.FirstName = modelRegister.CompanyName;
                    var result = await _userManager.CreateAsync(userToCreate, modelRegister.Password);
                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(userToCreate, "Client");
                        return Ok(result);
                    }
                    else
                    {
                        return BadRequest(result.Errors);
                    }
                }else
                {
                    return BadRequest();
                }
                
            }
            return BadRequest();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _userManager.FindByEmailAsync(userForLoginDto.Email);
            if(user != null)
            {
                    var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);
                    if (result.Succeeded)
                     { 
                        var appUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == userForLoginDto.Email);
                        var userToReturn = _mapper.Map<UserForLoginDto>(appUser);
                        var roles = _userManager.GetRolesAsync(appUser);
                        var role = roles.Result;
                    return Ok(new
                    {
                        result.Succeeded,
                        token = GenerateJwtToken(appUser),
                        user.Email,
                        user.Id,
                        role
                            
                        });
                    
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