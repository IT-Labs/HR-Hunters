using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
using HRHunters.Common.Responses.AdminDashboard;
using Microsoft.AspNetCore.Mvc;

namespace HRHunters.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicantsController : ControllerBase
    {
        private readonly IApplicantManager _applicantManager;

        public ApplicantsController(IApplicantManager applicantManager)
        {
            _applicantManager = applicantManager;
        }

        [HttpGet]
        public ActionResult<ApplicantResponse> GetMultipleApplicants(int pageSize = 10, int currentPage = 1, string sortedBy = "Id", SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "")
        {
            return Ok(_applicantManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery));
        }
    }
}