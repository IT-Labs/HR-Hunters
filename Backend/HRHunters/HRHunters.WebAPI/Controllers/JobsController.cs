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
    public class JobsController : BaseController
    {
        private readonly IJobManager _jobManager;
        public JobsController(IJobManager jobManager, IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _jobManager = jobManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetJobs([FromQuery]SearchRequest request)
        {
            return Ok(await _jobManager.GetMultiple(request));
        }

        [HttpGet("{id}")]
        public IActionResult GetOneJobPosting(int id)
        {
            return Ok(_jobManager.GetOneJobPosting(id));
        }

        [Authorize(Roles = RoleConstants.ADMIN + ", " + RoleConstants.CLIENT)]
        [HttpPost]
        public async Task<IActionResult> CreateJobPosting(JobSubmit jobSubmit)
        {
            var result = await _jobManager.CreateJobPosting(jobSubmit, CurrentUserId);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            else return BadRequest(result);
        }

        [Authorize(Roles = RoleConstants.ADMIN)]
        [HttpPut("{id}")]
        public IActionResult UpdateJob(JobUpdate jobSubmit, [FromRoute]int id)
        {
            var result = _jobManager.UpdateJob(jobSubmit, id);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            else return BadRequest(result);
        }   

        [Authorize(Roles = "Admin")]
        [HttpPost("UploadCSV/{Id}")]
        public IActionResult UploadCSV([FromForm]FileUpload fileUpload)
        {
            var result = _jobManager.UploadCSV(fileUpload);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            else return BadRequest(result);
        }
    }
}