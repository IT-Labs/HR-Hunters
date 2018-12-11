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
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationManager _applicationManager;

        public ApplicationsController(IApplicationManager applicationManager)
        {
            _applicationManager = applicationManager;
        }

        [HttpGet]
        public ActionResult<ApplicationResponse> GetMultipleApplications(int pageSize = 10, int currentPage = 1, string sortedBy = "Id", SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "")
        {
            return Ok(_applicationManager.GetMultiple(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery));
        }
        [HttpPut("{id}")]
        public ActionResult<ApplicationInfo> UpdateApplicationStatus(int id, string status)
        {
            return Ok(_applicationManager.UpdateApplicationStatus(id, status));
        }
    }
}