using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRHunters.WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireAdminRole")]
    public class AdminController : ControllerBase
    {
        //Test methods
        [HttpGet]
        public ActionResult<string> Index()
        {

            return "ok";
        }

        [HttpGet("{id}")]
        public ActionResult<string> Index2(int id)
        {
            return "value";
        }



    }
}