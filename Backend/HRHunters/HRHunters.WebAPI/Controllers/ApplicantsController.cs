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
        [HttpGet]
        public ActionResult<ApplicantResponse> GetMultipleApplicants([FromQuery]SearchRequest request)
        {
            return Ok(_applicantManager.GetMultiple(request));
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<GeneralResponse>> UpdateApplicantProfile(int id, ApplicantUpdate applicantUpdate)
        {
            return Ok(await _applicantManager.UpdateApplicantProfile(id, applicantUpdate));
        }
    }
}