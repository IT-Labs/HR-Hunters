using HRHunters.Common.Requests;
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
        Task<S3Response> UploadProfileImage(string bucketName, FileUpload fileUpload);
    }
}
