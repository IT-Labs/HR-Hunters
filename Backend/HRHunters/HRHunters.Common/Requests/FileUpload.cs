using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Requests
{
    public class FileUpload
    {
        public IFormFile FormFile { get; set; }
        public int Id { get; set; }
    }
}
