using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Requests.Users;
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
        public ActionResult<IEnumerable<Applicant>> GetMultipleApplicants(QueryParams queryParams)
        {
            return Ok(_applicantManager.GetMultiple( queryParams));
        }

        [HttpGet("applications")]
        public ActionResult<IEnumerable<Application>> GetMultipleApplications(QueryParams queryParams,ApplicationStatus filterBy)
        {
            return Ok(_applicationManager.GetMultiple(queryParams, filterBy));
        }

        [HttpGet("jobs")]
        public ActionResult<IEnumerable<JobPosting>> GetMultipleJobPosting(QueryParams queryParams,JobPostingStatus filterBy)
        {
            return Ok(_jobManager.GetMultiple( queryParams, filterBy));
        }

        [HttpGet("clients")]
        public ActionResult<IEnumerable<Client>> GetMultipleClients(QueryParams queryParams,ClientStatus filterBy)
        {
            return Ok(_clientManager.GetMultiple( queryParams, filterBy));
        }

        [HttpGet("jobs/{id}")]
        public ActionResult<string> Index2(int id)
        {
            return "value";
        }
        [HttpPost("jobs")]
        public ActionResult<IEnumerable<JobPosting>> CreateJobPosting(JobSubmit jobSubmit)
        {

            return null;
        }



    }
}