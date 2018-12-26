using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using HRHunters.Common.Constants;
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
    [Authorize]
    public class ClientsController : BaseController
    {
        private readonly IClientManager _clientManager;

        public ClientsController(IClientManager clientManager,IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
            _clientManager = clientManager;
        }
        
        [Authorize(Roles = RoleConstants.ADMIN)]
        [HttpGet]
        public IActionResult GetMultipleClients([FromQuery]SearchRequest request)
        {
            return Ok(_clientManager.GetMultiple(request));
        }
        [HttpGet("{id}")]
        public IActionResult GetOneClient(int id)
        {
            return Ok(_clientManager.GetOneClient(id));
        }
        [Authorize(Roles = RoleConstants.CLIENT)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClientProfile(int id, ClientUpdate clientUpdate)
        {
            if (CurrentUserId != id)
                return BadRequest((sentId: id, currentUserId: CurrentUserId));

            var result = await _clientManager.UpdateClientProfile(id, clientUpdate);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [Authorize(Roles = RoleConstants.CLIENT)]
        [HttpPut("image/{Id}")]
        public async Task<IActionResult> UpdateClientLogo([FromForm]FileUpload fileUpload)
        {
            if (CurrentUserId != fileUpload.Id)
                return BadRequest(fileUpload);
            var result = await _clientManager.UpdateCompanyLogo(fileUpload);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [Authorize(Roles = RoleConstants.ADMIN)]
        [HttpPut("{id}/status")]
        public IActionResult UpdateClientStatus(int id, ClientStatusUpdate statusUpdate)
        {
            var result = _clientManager.UpdateClientStatus(id, statusUpdate);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            else return BadRequest(result);
        }
        
        [Authorize(Roles = RoleConstants.ADMIN)]
        [HttpPost]
        public async Task<IActionResult> CreateCompany(NewCompany newCompany)
        {
            var result = await _clientManager.CreateCompany(newCompany);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}