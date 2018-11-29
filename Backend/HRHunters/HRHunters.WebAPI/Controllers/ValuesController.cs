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
    [Route("[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly IRepository _repo;

        public ValuesController(IRepository repo)
        {
            _repo = repo;
        }
        // GET admins/jobpostings
        [HttpGet]
        public ActionResult<IEnumerable<Applicant>> Get()
        {
            var values = _repo.GetAll<Applicant>();
            
            return Ok(values);
        }

        // GET admins/jobpostings/id
        [HttpGet("{id}")]
        public ActionResult<Applicant> Get(int id)
        {
            return _repo.GetById<Applicant>(id);
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
