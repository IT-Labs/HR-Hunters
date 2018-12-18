using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRHunters.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class S3BucketController : ControllerBase
    {
        private readonly IS3Service _service;
        public S3BucketController(IS3Service service)
        {
            _service = service;
        }
        [HttpPost("{bucketName}")]
        public async Task<IActionResult> CreateBucket([FromRoute]string bucketName)
        {
            return Ok(await _service.CreateBucketAsync(bucketName));
        }

    }
}