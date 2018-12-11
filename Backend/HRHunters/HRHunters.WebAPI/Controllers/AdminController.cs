using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using HRHunters.Domain.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRHunters.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    public class AdminController : ControllerBase
    {
        private readonly IApplicationManager _applicationManager;
        private readonly IApplicantManager _applicantManager;
        private readonly IJobManager _jobManager;
        private readonly IClientManager _clientManager;
        public AdminController(IApplicationManager applicationManager, IClientManager clientManager, IApplicantManager applicantManager, IJobManager jobManager)
        {
            _applicationManager = applicationManager;
            _applicantManager = applicantManager;
            _jobManager = jobManager;
            _clientManager = clientManager;
        }
        //Test methods

        [HttpGet("applicants")]
        public ActionResult<ApplicantResponse> GetMultipleApplicants(int pageSize = 10, int currentPage = 1, string sortedBy = "Id", SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "")
        {
            return Ok(_applicantManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery));
        }

      

        [HttpGet("jobs")]
        public ActionResult<JobResponse> GetMultipleJobPosting(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery)
        {
            return Ok(_jobManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery));
        }

        [HttpGet("jobs/addExistingCo")]
        public ActionResult<IEnumerable<ClientInfo>> GetMultipleClients()
        {
            return Ok(_clientManager.GetMultiple());
        }

        [HttpGet("clients")]
        public ActionResult<ClientResponse> GetMultipleClients(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery)
        {
            return Ok(_clientManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery));
        }

        [HttpGet("jobs/{id}")]
        public ActionResult<JobPosting> GetOneJobPosting(int id)
        {
            return Ok(_jobManager.GetOneJobPosting(id));
        }
        [HttpPost("jobs1")]
        public async Task<ActionResult<object>> CreateJobPosting(JobSubmit jobSubmit)
        {
            return Ok(await _jobManager.CreateJobPosting(jobSubmit));
        }

        [HttpPut("applications/{id}")]
        public ActionResult<ApplicationInfo> UpdateApplicationStatus(int id, string status)
        {
            return Ok(_applicationManager.UpdateApplicationStatus(id, status));
        }
        [HttpPut("clients/{id}")]
        public ActionResult<ClientInfo> UpdateClientStatus(int id, string status)
        {
            return Ok(_clientManager.UpdateClientStatus(id, status));
        }

        [HttpPut("jobs/{id}")]
        public ActionResult<JobInfo> UpdateJob(int id, [FromQuery]string status, [FromBody]JobUpdate jobSubmit)
        {
            return Ok(_jobManager.UpdateJob(id, status, jobSubmit));
        }
    }
}