using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using HRHunters.Common.Constants;
using HRHunters.Common.Entities;
using HRHunters.Common.HelperMethods;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Requests;
using HRHunters.Common.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace HRHunters.Domain.Managers
{
    public class S3Manager : IS3Manager
    {
        private readonly IAmazonS3 _amazonClient;
        private readonly IBaseManager _baseManager;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<S3Manager> _logger;
        public S3Manager(IAmazonS3 amazonClient, ILogger<S3Manager> logger, UserManager<User> userManager, IBaseManager baseManager)
        {
            _userManager = userManager;
            _baseManager = baseManager;
            _amazonClient = amazonClient;
            _logger = logger;
        }

        public async Task<S3Response> UploadProfileImage(string bucketName,FileUpload fileUpload)
        {
            Guid g;
            g = Guid.NewGuid();
            var response = new S3Response();
            var image = fileUpload.FormFile;

            if (image.ContentType != "image/jpg" && image.ContentType != "image/png" && image.ContentType != "image/jpeg")
            {
                return response;
            }
            try
            {
                var ext = image.FileName.EndsWith(".JPG")
                                ? ".JPG" : image.FileName.EndsWith(".PNG")
                                    ? ".PNG" : ".JPEG";
                var keyName = g.ToString() + ext;
                var fileTransferUtility = new TransferUtility(_amazonClient);
                using (var stream = new MemoryStream())
                {
                    image.CopyTo(stream);
                    await fileTransferUtility.UploadAsync(stream, bucketName, keyName);
                    response.Succeeded = true;
                    response.Guid = keyName;
                }
            }
            catch(Exception e)
            {
                _logger.LogError(e.Message, image);
            }
            return response;
        }
    }
}
