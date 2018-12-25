using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using HRHunters.Common.Constants;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
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

        public async Task<GeneralResponse> UploadFileAsync(string bucketName, IFormFile image, int id, int currentUserId)
        {
            Guid g;
            g = Guid.NewGuid();
            var response = new GeneralResponse();
            if (image.ContentType != "image/jpg" && image.ContentType != "image/png" && image.ContentType != "image/jpeg")
            {
                _logger.LogError(ErrorConstants.InvalidFormat, image);
                response.Errors["Error"].Add(ErrorConstants.InvalidFormat);
                return response;
            }
            if (id != currentUserId)
            {
                _logger.LogError(ErrorConstants.UnauthorizedAccess);
                throw new UnauthorizedAccessException(ErrorConstants.UnauthorizedAccess);
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
                }
                
                //Update database with user picture
                var user = await _userManager.FindByIdAsync(id.ToString());
                var role = await _userManager.GetRolesAsync(user);
                if (role.Contains(RoleConstants.APPLICANT))
                {
                    var applicant = _baseManager.GetById<Applicant>(id);
                    applicant.Logo = keyName;
                    _baseManager.Update(applicant, applicant.User.FirstName);
                }
                else if (role.Contains(RoleConstants.CLIENT))
                {
                    var client = _baseManager.GetById<Client>(id);
                    client.Logo = keyName;
                    _baseManager.Update(client, client.User.FirstName);
                }
                response.Succeeded = true;
                return response;
            }
            catch
            {
                _logger.LogError("Failed to upload image", image);
                response.Errors["Error"].Add("Failed to upload image.");
                return response;
            }
        }
    }
}
