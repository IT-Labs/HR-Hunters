using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace HRHunters.Domain.Managers
{
    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _client;
        private readonly ILogger<S3Service> _logger;
        public S3Service(IAmazonS3 client, ILogger<S3Service> logger)
        {
            _logger = logger;
            _client = client;
        }

        public async Task<S3Response> CreateBucketAsync(string bucketName)
        {
            try
            {
                if(await AmazonS3Util.DoesS3BucketExistAsync(_client, bucketName) == false)
                {
                    var putBucketRequest = new PutBucketRequest
                    {
                        BucketName = bucketName,
                        UseClientRegion = true
                    };

                    var response = await _client.PutBucketAsync(putBucketRequest);
                    return new S3Response
                    {
                        Message = response.ResponseMetadata.RequestId,
                        Status = response.HttpStatusCode
                    };
                }
            }catch(Exception e)
            {
                _logger.LogError(e.Message);
                return new S3Response
                {
                    Status = HttpStatusCode.InternalServerError,
                    Message = "Something went wrong"
                };
            }
            return new S3Response
            {
                Status = HttpStatusCode.InternalServerError,
                Message = "Something went wrong"
            };
        }
    }
}
