using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Entities;
using HRHunters.Data;
using HRHunters.Data.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace HRHunters.WebAPI.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly IRepository _repo;

        public ValuesController(IRepository repo)
        {
            _repo = repo;
        }
        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<User>> Get()
        {
            var values = _repo.GetAll<User>();

            return Ok(values);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
