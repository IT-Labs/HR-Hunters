using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
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
        public ActionResult<IEnumerable<ApplicantInfo>> GetMultipleApplicants(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery)
        {
            return Ok(_applicantManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery));
        }

        [HttpGet("applications")]
        public ActionResult<IEnumerable<ApplicationInfo>> GetMultipleApplications(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery)
        {
            return Ok(_applicationManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery));
        }

        [HttpGet("jobs")]
        public ActionResult<IEnumerable<JobInfo>> GetMultipleJobPosting(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery)
        {
            return Ok(_jobManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery));
        }

        [HttpGet("clients")]
        public ActionResult<IEnumerable<ClientInfo>> GetMultipleClients(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery)
        {
            return Ok(_clientManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery));
        }

        [HttpGet("jobs/{id}")]
        public ActionResult<JobPosting> GetOneJobPosting(int id)
        {
            return Ok(_jobManager.GetOneJobPosting(id));
        }
        [HttpPost("jobs1")]
        public ActionResult<IEnumerable<JobPosting>> CreateJobPosting(JobSubmit jobSubmit)
        {

            return null;
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
        public ActionResult<JobInfo> UpdateJobStatus(int id, string status)
        {
            return Ok(_jobManager.UpdateJobStatus(id, status));
        }
    }
}