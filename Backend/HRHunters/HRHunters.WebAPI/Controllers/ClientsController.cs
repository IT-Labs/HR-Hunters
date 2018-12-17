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
        public ActionResult<ClientResponse> GetMultipleClients([FromQuery]SearchRequest request)
        {
            return Ok(_clientManager.GetMultiple(request,GetCurrentUserId()));
        }

        [Authorize(Roles = "Client")]
        [HttpPut("{id}")]
        public async Task<ActionResult<GeneralResponse>> UpdateClientProfile(int id, ClientUpdate clientUpdate)
        {
            return Ok(await _clientManager.UpdateClientProfile(id, clientUpdate,GetCurrentUserId()));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public ActionResult<GeneralResponse> UpdateClientStatus(ClientStatusUpdate clientStatusUpdate)
        {
            return Ok(_clientManager.UpdateClientStatus(clientStatusUpdate));
        }
        
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<GeneralResponse>> CreateCompany(NewCompany newCompany)
        {
            return Ok(await _clientManager.CreateCompany(newCompany, GetCurrentUserId()));
        }
    }
}