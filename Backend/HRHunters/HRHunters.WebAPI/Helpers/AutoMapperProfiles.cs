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
using HRHunters.Common.Enums;
using HRHunters.Common.Constants;

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
                                                    .ForPath(x => x.User.Email, opt => opt.MapFrom(y => y.Email))
                                                    .ForPath(x => x.EducationType, opt => opt.Ignore())
                                                    .ForPath(x => x.Id, opt => opt.Ignore());
            CreateMap<JobUpdate, JobPosting>().ForMember(x => x.DateFrom, opt => opt.Ignore())
                                                .ForMember(x => x.DateTo, opt => opt.Ignore())
                                                .ForMember(x => x.EmpCategory, opt => opt.Ignore())
                                                .ForMember(x => x.Education, opt => opt.Ignore()).
                                                ForMember(x => x.Title, opt => opt.MapFrom(x => x.JobTitle))
                                                .ForMember(x => x.NeededExperience, opt => opt.MapFrom(x => x.Experience));
            CreateMap<JobPosting, JobInfo>().ForMember(x => x.CompanyEmail, opt => opt.MapFrom(x => x.Client.User.Email))
                                            .ForMember(x => x.CompanyName, opt => opt.MapFrom(x => x.Client.User.FirstName))
                                            .ForMember(x => x.AllApplicationsCount, opt => opt.MapFrom(x => x.Applications.Count))
                                            .ForMember(x => x.JobTitle, opt => opt.MapFrom(x => x.Title))
                                            .ForMember(x => x.JobType, opt => opt.MapFrom(x => x.EmpCategory.ToString()))
                                            .ForMember(x => x.Status, opt => opt.MapFrom(x => x.Status.ToString()))
                                            .ForMember(x => x.DateTo, opt => opt.MapFrom(x => x.DateTo.ToString("yyyy/MM/dd")))
                                            .ForMember(x => x.DateFrom, opt => opt.MapFrom(x => x.DateFrom.ToString("yyyy/MM/dd")))
                                            .ForMember(x => x.Education, opt => opt.MapFrom(x => x.Education.ToString()))
                                            .ForMember(x => x.Experience, opt => opt.MapFrom(x => x.NeededExperience.ToString()))
                                            .ForMember(x => x.Location, opt => opt.MapFrom(x => x.Client.Location));
            CreateMap<Client, ClientInfo>().ForMember(x => x.Id, opt => opt.MapFrom(x => x.UserId))
                                            .ForMember(x => x.CompanyName, opt => opt.MapFrom(x => x.User.FirstName))
                                            .ForMember(x => x.Email, opt => opt.MapFrom(x => x.User.Email))
                                            .ForMember(x => x.ActiveJobs, opt => opt.MapFrom(x => x.JobPostings.Count))
                                            .ForMember(x => x.Status, opt => opt.MapFrom(x => x.Status.ToString()))
                                            .ForMember(x => x.Logo, opt => opt.MapFrom(x => EnvironmentVariables.CLOUD_FRONT_URL + x.Logo))
                                            .ForMember(x => x.AllJobs, opt => opt.MapFrom(x => x.JobPostings.Count(y => y.DateTo < DateTime.UtcNow)));
            CreateMap<JobSubmit, JobPosting>().ForMember(x => x.Id, opt => opt.Ignore())
                                                .ForMember(x => x.DateFrom, opt => opt.Ignore())
                                                 .ForMember(x => x.DateTo, opt => opt.Ignore())
                                                 .ForMember(x => x.Education, opt => opt.Ignore())
                                                 .ForMember(x => x.EmpCategory, opt => opt.Ignore());
            CreateMap<NewCompany, Client>().ForPath(x => x.User.FirstName, opt => opt.MapFrom(x => x.CompanyName))
                                            .ForPath(x => x.User.Email, opt => opt.MapFrom(x => x.Email));
            
            CreateMap<Application, ApplicationInfo>().ForMember(x => x.ApplicantEmail, opt => opt.MapFrom(x => x.Applicant.User.Email))
                                                     .ForMember(x => x.ApplicantFirstName, opt => opt.MapFrom(x => x.Applicant.User.FirstName))
                                                     .ForMember(x => x.ApplicantLastName, opt => opt.MapFrom(x => x.Applicant.User.LastName))
                                                     .ForMember(x => x.Experience, opt => opt.MapFrom(x => x.Applicant.Experience))
                                                     .ForMember(x => x.JobTitle, opt => opt.MapFrom(x => x.JobPosting.Title))
                                                     .ForMember(x => x.PostedOn, opt => opt.MapFrom(x => x.Date.ToString("yyy/MM/dd")))
                                                     .ForMember(x => x.Status, opt => opt.MapFrom(x => x.Status.ToString()))
                                                     .ForMember(x => x.DateFrom, opt => opt.MapFrom(x=>x.JobPosting.DateFrom.ToString("yyy/MM/dd")))
                                                     .ForMember(x => x.DateTo, opt => opt.MapFrom(x => x.JobPosting.DateTo.ToString("yyy/MM/dd")))
                                                     .ForMember(x => x.JobType, opt => opt.MapFrom(x => x.JobPosting.EmpCategory.ToString()));

            CreateMap<Applicant, ApplicantInfo>().ForMember(x => x.Id, opt => opt.MapFrom(x => x.UserId))
                                                    .ForMember(x => x.FirstName, opt => opt.MapFrom(x => x.User.FirstName))
                                                    .ForMember(x => x.LastName, opt => opt.MapFrom(x => x.User.LastName))
                                                    .ForMember(x => x.Email, opt => opt.MapFrom(x => x.User.Email))
                                                    .ForMember(x => x.Photo, opt => opt.MapFrom(x => EnvironmentVariables.CLOUD_FRONT_URL+x.Logo))
                                                    .ForMember(x => x.School, opt => opt.MapFrom(x => x.SchoolUniversity))
                                                    .ForMember(x => x.Education, opt => opt.MapFrom(x=>x.EducationType.ToString()));
                                                     
            CreateMap<JobPosting, JobPosting>().ForMember(x => x.Id, opt => opt.Ignore());
        }
    }
}
