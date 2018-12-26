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
    public class ApplicationsController : BaseController
    {
        private readonly IApplicationManager _applicationManager;

        public ApplicationsController(IApplicationManager applicationManager,IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _applicationManager = applicationManager;
        }

        [Authorize(Roles = RoleConstants.APPLICANT)]
        [HttpGet("{id}")]
        public IActionResult GetOneApplication(int id)  
        {
            return Ok(_applicationManager.GetOneApplication(id));
        }

        [Authorize(Roles = RoleConstants.ADMIN + ", " + RoleConstants.APPLICANT)]
        [HttpGet]
        public async Task<IActionResult> GetMultipleApplications([FromQuery]SearchRequest request)
        {
            return Ok(await _applicationManager.GetMultiple(request));
        }
        
        [Authorize(Roles = RoleConstants.ADMIN)]
        [HttpPut("{id}/status")]
        public IActionResult UpdateApplicationStatus(int id, [FromBody]ApplicationStatusUpdate statusUpdate)
        {
            var result = _applicationManager.UpdateApplicationStatus(id, statusUpdate);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [Authorize(Roles = RoleConstants.APPLICANT)]
        [HttpPost]
        public async Task<IActionResult> CreateApplication(Apply apply)
        {
            if (CurrentUserId != apply.ApplicantId)
                return BadRequest(apply);
            var result = await _applicationManager.CreateApplication(apply);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            else return BadRequest(result);
        }


    }
}