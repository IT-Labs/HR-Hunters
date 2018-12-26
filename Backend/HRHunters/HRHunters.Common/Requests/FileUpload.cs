using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Requests
{
    public class FileUpload
    {
        [FromForm]
        public IFormFile FormFile{ get; set; }
        [FromRoute]
        public int Id { get; set; }
    }
}
