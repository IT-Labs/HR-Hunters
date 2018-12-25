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

namespace HRHunters.Domain.Managers
{
    public class ApplicantManager : BaseManager, IApplicantManager
    {
        private readonly IRepository _repo;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<ApplicantManager> _logger;
        public ApplicantManager(IRepository repo, UserManager<User> userManager, IMapper mapper, ILogger<ApplicantManager> logger) : base(repo)
        {
            _logger = logger;
            _repo = repo;
            _mapper = mapper;
            _userManager = userManager;
        }

        public ApplicantResponse GetMultiple(SearchRequest request,int currentUserId)
        {
            if (currentUserId != request.Id)
            {
                _logger.LogError(ErrorConstants.UnauthorizedAccess);
                throw new UnauthorizedAccessException(ErrorConstants.UnauthorizedAccess);
            }
            var response = new ApplicantResponse() { Applicants = new List<ApplicantInfo>()};

            var query = _repo.GetAll<Applicant>(includeProperties: $"{nameof(User)},");

            var selected = _mapper.ProjectTo<ApplicantInfo>(query)
                                        .Applyfilters(request).ToList();
            
             
            response.Applicants.AddRange(selected);
            response.MaxApplicants = _repo.GetCount<Applicant>();
            return response;
        }

        public ApplicantInfo GetOneApplicant(int id)
        {
            var query = _repo.GetOne<Applicant>(x => x.Id == id, includeProperties: $"{nameof(User)}");
            return _mapper.Map<ApplicantInfo>(query);
        }

        public async Task<GeneralResponse> UpdateApplicantProfile(int id, ApplicantUpdate applicantUpdate, int currentUserId)
        {
            var response = new GeneralResponse();
            if (currentUserId != id)
            {
                return response.ErrorHandling(ErrorConstants.UnauthorizedAccess, _logger, id, currentUserId);
            }
            var user = await _userManager.FindByIdAsync(id.ToString());

            var applicant = _repo.GetById<Applicant>(id);

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
                response.Succeeded = false;
                return response.ErrorHandling<ApplicantManager>("Email is already in use");
            }
            try
            {
                _repo.Update(applicant, applicant.User.FirstName);
                await _userManager.UpdateAsync(user);
                response.Succeeded = true;
                return response;
            }
            catch(Exception e)
            {
                return response.ErrorHandling(e.Message, _logger, applicant);
            }
        }
    }

}
