using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HRHunters.Common.Constants;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using HRHunters.Common.Responses.AdminDashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRHunters.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ApplicantsController : ControllerBase
    {
        private readonly IApplicantManager _applicantManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApplicantsController(IApplicantManager applicantManager, IHttpContextAccessor httpContextAccessor)
        {
            _applicantManager = applicantManager;
            _httpContextAccessor = httpContextAccessor;
        }
        private int GetCurrentUserId()
        {
            return int.Parse(_httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }
        [HttpGet("{id}")]
        public IActionResult GetOneApplicant(int id)
        {
            return Ok(_applicantManager.GetOneApplicant(id));
        }
        [Authorize(Roles = RoleConstants.ADMIN)]
        [HttpGet]
        public IActionResult GetMultipleApplicants([FromQuery]SearchRequest request)
        {
            return Ok(_applicantManager.GetMultiple(request));
        }
        [Authorize(Roles = RoleConstants.APPLICANT)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateApplicantProfile(int id, ApplicantUpdate applicantUpdate)
        {
            var result = await _applicantManager.UpdateApplicantProfile(id, applicantUpdate, GetCurrentUserId());
            if (result.Succeeded)
            {
                return Ok(result);
            }
            else return BadRequest(result);
        }
    }
}