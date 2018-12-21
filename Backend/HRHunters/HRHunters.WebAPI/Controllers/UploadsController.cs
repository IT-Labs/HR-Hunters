using HRHunters.Common.Constants;
using HRHunters.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HRHunters.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UploadsController : ControllerBase
    {
        private readonly IS3Manager _s3Manager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UploadsController(IS3Manager s3Manager, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _s3Manager = s3Manager;
        }
        private int GetCurrentUserId()
        {
            return int.Parse(_httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }
        [Authorize(Roles = "Applicant, Client")]
        [HttpPost("Image/{id}")]
        public async Task<IActionResult> UploadImageAsync(IFormFile image, [FromRoute]int id)
        {
            return Ok(await _s3Manager.UploadFileAsync(EnvironmentVariables.BUCKET_NAME, image, id, GetCurrentUserId()));
        }
    }
}
