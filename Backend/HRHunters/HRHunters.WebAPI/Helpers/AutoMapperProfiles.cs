using AutoMapper;
using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common;
using HRHunters.Common.Requests.Users;
using HRHunters.Common.Responses;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Responses.AdminDashboard;

namespace HRHunters.WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserLoginModel>();
            CreateMap<User, UserRegisterModel>();
            CreateMap<UserRegisterModel, User>();
            CreateMap<User, UserLoginReturnModel>();
            CreateMap<UserLoginModel, User>();
            CreateMap<ClientUpdate, Client>().ForPath(x => x.User.FirstName, opt => opt.MapFrom(y => y.CompanyName))
                                             .ForPath(x => x.User.Email, opt => opt.MapFrom(y => y.CompanyEmail));
                                             
            CreateMap<ApplicantUpdate, Applicant>().ForPath(x => x.User.FirstName, opt => opt.MapFrom(y => y.FirstName))
                                                    .ForPath(x => x.User.LastName, opt => opt.MapFrom(y => y.LastName))
                                                    .ForPath(x => x.User.Email, opt => opt.MapFrom(y => y.Email));
            CreateMap<JobUpdate, JobPosting>().ForMember(x => x.DateFrom, opt => opt.Ignore())
                                                .ForMember(x => x.DateTo, opt => opt.Ignore())
                                                .ForMember(x => x.EmpCategory, opt => opt.Ignore())
                                                .ForMember(x => x.Education, opt => opt.Ignore()).
                                                ForMember(x => x.Title, opt => opt.MapFrom(x => x.JobTitle));
            CreateMap<JobPosting, JobInfo>().ForMember(x => x.CompanyEmail, opt => opt.MapFrom(x => x.Client.User.Email))
                                            .ForMember(x => x.CompanyName, opt => opt.MapFrom(x => x.Client.User.FirstName))
                                            .ForMember(x => x.AllApplicationsCount, opt => opt.MapFrom(x => x.Applications.Count))
                                            .ForMember(x => x.JobTitle, opt => opt.MapFrom(x => x.Title))
                                            .ForMember(x => x.JobType, opt => opt.MapFrom(x => x.EmpCategory.ToString()))
                                            .ForMember(x => x.Status, opt => opt.MapFrom(x => x.Status.ToString()))
                                            .ForMember(x => x.DateTo, opt => opt.MapFrom(x => x.DateTo.ToString()));
            CreateMap<Client, ClientInfo>().ForMember(x => x.Id, opt => opt.MapFrom(x => x.UserId))
                                            .ForMember(x => x.CompanyName, opt => opt.MapFrom(x => x.User.FirstName))
                                            .ForMember(x => x.Email, opt => opt.MapFrom(x => x.User.Email))
                                            .ForMember(x => x.ActiveJobs, opt => opt.MapFrom(x => x.JobPostings.Count))
                                            .ForMember(x => x.Status, opt => opt.MapFrom(x => x.Status.ToString()))
                                            .ForMember(x => x.Logo, opt => opt.Ignore())
                                            .ForMember(x => x.AllJobs, opt => opt.MapFrom(x => x.JobPostings.Count(y => y.DateTo < DateTime.UtcNow)));
            CreateMap<JobSubmit, JobPosting>().ForMember(x => x.Id, opt => opt.Ignore())
                                                .ForMember(x => x.DateFrom, opt => opt.Ignore())
                                                 .ForMember(x => x.DateTo, opt => opt.Ignore())
                                                 .ForMember(x => x.Education, opt => opt.Ignore())
                                                 .ForMember(x => x.EmpCategory, opt => opt.Ignore());
            CreateMap<NewCompany, Client>().ForPath(x => x.User.FirstName, opt => opt.MapFrom(x => x.CompanyName))
                                            .ForPath(x => x.User.Email, opt => opt.MapFrom(x => x.Email));
        }
    }
}
