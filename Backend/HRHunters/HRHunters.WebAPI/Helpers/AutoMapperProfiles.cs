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
        }
    }
}
