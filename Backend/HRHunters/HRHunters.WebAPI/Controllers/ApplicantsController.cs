using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HRHunters.Common.Constants;
using HRHunters.Common.Entities;
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
    public class ApplicantsController : BaseController
    {
        private readonly IApplicantManager _applicantManager;

        public ApplicantsController(IApplicantManager applicantManager, IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _applicantManager = applicantManager;
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
            if (CurrentUserId != id)
                return BadRequest(applicantUpdate);

            var result = await _applicantManager.UpdateApplicantProfile(id, applicantUpdate);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [Authorize(Roles = RoleConstants.APPLICANT)]
        [HttpPut("image/{Id}")]
        public async Task<IActionResult> UpdateProfileImage([FromForm]FileUpload fileUpload)
        {
            if (CurrentUserId != fileUpload.Id)
                return BadRequest(fileUpload);

            var result = await _applicantManager.UpdateProfileImage(fileUpload);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}