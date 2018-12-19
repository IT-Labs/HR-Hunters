using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
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
    public class JobsController : ControllerBase
    {
        private readonly IJobManager _jobManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public JobsController(IJobManager jobManager, IHttpContextAccessor httpContextAccessor)
        {
            _jobManager = jobManager;
            _httpContextAccessor = httpContextAccessor;
        }
        private int GetCurrentUserId()
        {
            return int.Parse(_httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetJobs([FromQuery]SearchRequest request)
        {
            return Ok(await _jobManager.GetMultiple(request, GetCurrentUserId()));
        }

        [Authorize(Roles = "Applicant, Client")]
        [HttpGet("{id}")]
        public IActionResult GetOneJobPosting(int id)
        {
            return Ok(_jobManager.GetOneJobPosting(id));
        }

        [Authorize(Roles ="Admin, Client")]
        [HttpPost]
        public async Task<IActionResult> CreateJobPosting(JobSubmit jobSubmit)
        {
            return Ok(await _jobManager.CreateJobPosting(jobSubmit, GetCurrentUserId()));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public IActionResult UpdateJob(JobUpdate jobSubmit)
        {
            return Ok(_jobManager.UpdateJob(jobSubmit, GetCurrentUserId()));
        }
        //[Authorize(Roles="Admin")]
        [HttpPost("Multiple")]
        public IActionResult CreateMultiple(int id)
        {
            return Ok(_jobManager.CreateMultiple(id));
        }
    }
}