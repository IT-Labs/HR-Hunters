using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using HRHunters.Common.Responses.AdminDashboard;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize(policy: "RequireAdminRole")]
        [HttpGet]
        public ActionResult<ApplicantResponse> GetMultipleApplicants(int pageSize = 0, int currentPage = 0, string sortedBy = "Id", SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "")
        {
            return Ok(_applicantManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery));
        }
        [Authorize(policy: "RequireApplicantRole")]
        [HttpPut]
        public async Task<ActionResult<GeneralResponse>> UpdateApplicantProfile(ApplicantUpdate applicantUpdate)
        {
            return Ok(await _applicantManager.UpdateApplicantProfile(applicantUpdate));
        }
    }
}