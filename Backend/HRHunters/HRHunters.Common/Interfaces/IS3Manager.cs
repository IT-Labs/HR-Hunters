using HRHunters.Common.Responses;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IS3Manager
    {
        Task<GeneralResponse> UploadFileAsync(string bucketName, IFormFile file, int id, int currentUserId);
    }
}
