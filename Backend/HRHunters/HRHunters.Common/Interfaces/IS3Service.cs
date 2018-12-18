using HRHunters.Common.Responses;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface IS3Service
    {
        Task<S3Response> CreateBucketAsync(string bucketName);
    }
}
