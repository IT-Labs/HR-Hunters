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
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationManager _applicationManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApplicationsController(IApplicationManager applicationManager,IHttpContextAccessor httpContextAccessor)
        {
            _applicationManager = applicationManager;
            _httpContextAccessor = httpContextAccessor;
        }
        private int GetCurrentUserId()
        {
            return int.Parse(_httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }
        [HttpGet]
        public ActionResult<ApplicationResponse> GetMultipleApplications([FromQuery]SearchRequest request)
        {
            return Ok(_applicationManager.GetMultiple(request, GetCurrentUserId()));
        }
        [HttpPut]
        public ActionResult<ApplicationInfo> UpdateApplicationStatus(ApplicationStatusUpdate applicationStatusUpdate)
        {
            return Ok(_applicationManager.UpdateApplicationStatus(applicationStatusUpdate));
        }
        [HttpPost]
        public ActionResult<GeneralResponse> CreateApplication(Apply apply)
        {
            //var currentUserId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return Ok(_applicationManager.CreateApplication(apply));
        }


    }
}