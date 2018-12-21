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
using HRHunters.Common.Requests.Admin;
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
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationManager _applicationManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApplicationsController(IApplicationManager applicationManager,IHttpContextAccessor httpContextAccessor)
        {
            _applicationManager = applicationManager;
            _httpContextAccessor = httpContextAccessor;
        }
        private int GetCurrentUserId()
        {
            return int.Parse(_httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }

        [Authorize(Roles = RoleConstants.APPLICANT)]
        [HttpGet("{id}")]
        public IActionResult GetOneApplication(int id)  
        {
            return Ok(_applicationManager.GetOneApplication(id, GetCurrentUserId()));
        }
        [Authorize(Roles = RoleConstants.ADMIN + ", " + RoleConstants.APPLICANT)]
        [HttpGet]
        public async Task<IActionResult> GetMultipleApplications([FromQuery]SearchRequest request)
        {
            return Ok(await _applicationManager.GetMultiple(request, GetCurrentUserId()));
        }        
        [Authorize(Roles = RoleConstants.ADMIN)]
        [HttpPut]
        public IActionResult UpdateApplicationStatus(ApplicationStatusUpdate applicationStatusUpdate)
        {
            return Ok(_applicationManager.UpdateApplicationStatus(applicationStatusUpdate));
        }
        [Authorize(Roles = RoleConstants.APPLICANT)]
        [HttpPost]
        public IActionResult CreateApplication(Apply apply)
        {
            var result = _applicationManager.CreateApplication(apply, GetCurrentUserId());
            if (result.Succeeded)
            {
                return Ok(result);
            }
            else return BadRequest(result);
        }


    }
}