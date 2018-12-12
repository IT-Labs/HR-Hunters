using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using HRHunters.Common.Responses.AdminDashboard;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRHunters.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly IJobManager _jobManager;
        public JobsController(IJobManager jobManager)
        {
            _jobManager = jobManager;
        }

        [HttpGet]
        public async Task<ActionResult<JobResponse>> GetJobs(int pageSize = 10, int currentPage = 1, string sortedBy = "Id", 
            SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "",int id=0)
        {
            return Ok(await _jobManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery, id));
        }

        [HttpGet("{id}")]
        public ActionResult<JobResponse> GetOneJobPosting(int id)
        {
            return Ok(_jobManager.GetOneJobPosting(id));
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreateJobPosting(JobSubmit jobSubmit)
        {
            return Ok(await _jobManager.CreateJobPosting(jobSubmit));
        }

        [HttpPut("{id}")]
        public ActionResult<GeneralResponse> UpdateJob(int id, [FromQuery]string status, [FromBody]JobUpdate jobSubmit)
        {
            return Ok(_jobManager.UpdateJob(id, status, jobSubmit));
        }
    }
}