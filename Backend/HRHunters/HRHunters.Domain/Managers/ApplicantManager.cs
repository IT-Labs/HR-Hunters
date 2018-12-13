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

namespace HRHunters.Domain.Managers
{
    public class ApplicantManager : BaseManager, IApplicantManager
    {
        private readonly IRepository _repo;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        public ApplicantManager(IRepository repo, UserManager<User> userManager, IMapper mapper) : base(repo)
        {
            _repo = repo;
            _mapper = mapper;
            _userManager = userManager;
        }

        public ApplicantResponse GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery)
        {
            var response = new ApplicantResponse() { Applicants = new List<ApplicantInfo>()};
                var query = _repo.GetAll<Applicant>(
                    includeProperties: $"{nameof(Applicant.User)},")
                                        .Select(
                                        x =>  new ApplicantInfo
                                        {
                                            Id = x.UserId,
                                            FirstName = x.User.FirstName,
                                            LastName = x.User.LastName,
                                            Email = x.User.Email,
                                            PhoneNumber = x.PhoneNumber,
                                            Photo = x.Logo
                                        })
                                        .Applyfilters(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery)
                                        .ToList();
            response.Applicants.AddRange(query);
            response.MaxApplicants = _repo.GetCount<Applicant>();
            return response;
        }

        public async Task<GeneralResponse> UpdateApplicantProfile(ApplicantUpdate applicantUpdate)
        {
            var response = new GeneralResponse()
            {
                Succeeded = true,
                Errors = new Dictionary<string, List<string>>()
            };
            var user = await _userManager.FindByIdAsync(applicantUpdate.UserId.ToString());

            var applicant = _repo.GetById<Applicant>(applicantUpdate.UserId);
            if (user != null && applicantUpdate != null)
            {
                applicant = _mapper.Map(applicantUpdate, applicant);
                applicant.ModifiedBy = "User";
                applicant.ModifiedDate = DateTime.UtcNow;
                try
                {
                    _repo.Update(applicant, "User");
                    await _userManager.UpdateAsync(user);
                    return response;
                }
                catch (Exception e)
                {
                    throw new Exception(e.Message);
                }
            }
            var list = new List<string>()
            {
                "This is bad."
            };
            response.Errors.Add("Error", list);
            return response;
        }
    }

}
