using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
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
    public class ClientsController : ControllerBase
    {
        private readonly IClientManager _clientManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ClientsController(IClientManager clientManager,IHttpContextAccessor httpContextAccessor )
        {
            _clientManager = clientManager;
            _httpContextAccessor = httpContextAccessor;
        }
        private int GetCurrentUserId()
        {
            return int.Parse(_httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult GetMultipleClients([FromQuery]SearchRequest request)
        {
            return Ok(_clientManager.GetMultiple(request,GetCurrentUserId()));
        }
        [HttpGet("{id}")]
        public IActionResult GetOneClient(int id)
        {
            return Ok(_clientManager.GetOneClient(id));
        }
        [Authorize(Roles = "Client")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClientProfile(int id, ClientUpdate clientUpdate)
        {
            var result = await _clientManager.UpdateClientProfile(id, clientUpdate, GetCurrentUserId());
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public IActionResult UpdateClientStatus(ClientStatusUpdate clientStatusUpdate)
        {
            var result = (_clientManager.UpdateClientStatus(clientStatusUpdate));
            if (result.Succeeded)
            {
                return Ok(result);
            }
            else return BadRequest(result);
        }
        
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateCompany(NewCompany newCompany)
        {
            var result = await _clientManager.CreateCompany(newCompany, GetCurrentUserId());
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
    }
}