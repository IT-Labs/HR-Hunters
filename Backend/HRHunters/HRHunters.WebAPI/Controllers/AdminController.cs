using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Data;
using HRHunters.Domain.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRHunters.WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize(Policy = "RequireAdminRole")]
    public class AdminController : ControllerBase
    {
        private readonly IApplicationManager _applicationManager;
        public AdminController(IApplicationManager applicationManager)
        {
            _applicationManager = applicationManager;
        }
        //Test methods
        [HttpGet]
        public ActionResult<IEnumerable<Application>> Index()
        {
            return Ok(_applicationManager.GetAllApplications());
        }

        [HttpGet("{id}")]
        public ActionResult<string> Index2(int id)
        {
            return "value";
        }



    }
}