using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Data;
using HRHunters.Common.ExtensionMethods;
using HRHunters.Common.Requests;
using HRHunters.Common.Responses;
using System.Threading.Tasks;
using HRHunters.Common.Requests.Users;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using HRHunters.Common.Exceptions;
using Microsoft.Extensions.Logging;
using HRHunters.Common.Constants;
using HRHunters.Common.HelperMethods;
using Microsoft.AspNetCore.Http;

namespace HRHunters.Domain.Managers
{
    public class ApplicantManager : BaseManager, IApplicantManager
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<ApplicantManager> _logger;
        private readonly IS3Manager _s3Manager;
        public ApplicantManager(IRepository repo, IS3Manager s3Manager, UserManager<User> userManager, IMapper mapper, ILogger<ApplicantManager> logger) : base(repo)
        {
            _s3Manager = s3Manager;
            _logger = logger;
            _mapper = mapper;
            _userManager = userManager;
        }

        public ApplicantResponse GetMultiple(SearchRequest request)
        {
            var response = new ApplicantResponse() { Applicants = new List<ApplicantInfo>()};

            var query = GetAll<Applicant>(includeProperties: $"{nameof(User)},");

            var selected = _mapper.ProjectTo<ApplicantInfo>(query)
                                        .Applyfilters(request).ToList();
            
             
            response.Applicants.AddRange(selected);
            response.MaxApplicants = GetCount<Applicant>();
            return response;
        }

        public ApplicantInfo GetOneApplicant(int id)
        {
            return _mapper.Map<ApplicantInfo>(GetById<Applicant>(id));
        }

        public async Task<GeneralResponse> UpdateApplicantProfile(int id, ApplicantUpdate applicantUpdate)
        {
            var response = new GeneralResponse();
            
            var user = await _userManager.FindByIdAsync(id.ToString());

            var applicant = GetById<Applicant>(id);

            applicant = _mapper.Map(applicantUpdate, applicant);
            bool educationParse = Enum.TryParse(applicantUpdate.EducationType,out EducationType educationType);

            if (!educationParse)
                return response.ErrorHandling(ErrorConstants.InvalidInput, _logger, applicantUpdate.EducationType);

            applicant.EducationType = educationType;
            applicant.User.ModifiedBy = applicant.User.FirstName;
            applicant.User.ModifiedDate = DateTime.UtcNow;
            var existingUser = await _userManager.FindByEmailAsync(applicant.User.Email);

            //Allow the current user to use their existing email
            if (existingUser != null && user != existingUser)
            {
                return response.ErrorHandling<ApplicantManager>("Email is already in use");
            }
            try
            {
                Update(applicant, applicant.User.FirstName);
                await _userManager.UpdateAsync(user);
                response.Succeeded = true;
                return response;
            }
            catch(Exception e)
            {
                return response.ErrorHandling(e.Message, _logger, applicant);
            }
        }

        public async Task<GeneralResponse> UpdateProfileImage(FileUpload fileUpload)
        {
            var response = new GeneralResponse();
            var result = await _s3Manager.UploadProfileImage(EnvironmentVariables.BUCKET_NAME, fileUpload);
            if (!result.Succeeded)
            {
                return response.ErrorHandling(ErrorConstants.FailedToUpdateDatabase, _logger, fileUpload);
            }
            var applicant = GetOne<Applicant>(x => x.Id == fileUpload.Id, includeProperties: $"{nameof(User)}");
            applicant.Logo = result.Guid;
            Update(applicant, applicant.User.FirstName);
            response.Succeeded = true;
            return response;
        }
    }

}
