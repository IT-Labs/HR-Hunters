using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests.Users;
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
        public ActionResult<JobResponse> GetJobs(JobSubmit jobSubmit)
        {
            return Ok(_jobManager.CreateJobPosting(jobSubmit));
        }
        [HttpGet("/{id}")]
        public ActionResult<JobPosting> GetOneJobPosting(int id)
        {
            return Ok(_jobManager.GetOneJobPosting(id));
        }
    }
}