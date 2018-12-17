using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
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
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public ActionResult<ApplicantResponse> GetMultipleApplicants([FromQuery]SearchRequest request)
        {
            return Ok(_applicantManager.GetMultiple(request));
        }
        [Authorize(Roles = "Applicant")]
        [HttpPut("{id}")]
        public async Task<ActionResult<GeneralResponse>> UpdateApplicantProfile(int id, ApplicantUpdate applicantUpdate)
        {
            return Ok(await _applicantManager.UpdateApplicantProfile(id, applicantUpdate, GetCurrentUserId()));
        }
    }
}