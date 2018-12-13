using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses.AdminDashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRHunters.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
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
        [Authorize(policy: "RequireApplicantRole")]
        [HttpGet]
        public ActionResult<ApplicationResponse> GetMultipleApplications(int pageSize = 10, int currentPage = 1, string sortedBy = "Id", SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "",int id=0)
        {
            return Ok(_applicationManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery,id));
        }
        [Authorize(policy: "RequireAdminRole")]
        [HttpPut("{id}")]
        public ActionResult<ApplicationInfo> UpdateApplicationStatus(int id, string status)
        {
            return Ok(_applicationManager.UpdateApplicationStatus(id, status));
        }
        [Authorize(policy:"RequireApplicantRole")]
        [HttpPost]
        public async Task<object> CreateApplication(Apply apply)
        {
            var currentUserId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return Ok(await _applicationManager.CreateApplication(apply,currentUserId));
        }


    }
}