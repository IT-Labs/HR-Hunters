using AutoMapper;
using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common;
using HRHunters.Common.DTOs;
using HRHunters.Common.Requests;

namespace HRHunters.WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForLoginDto>();
            CreateMap<User, UserRegisterModel>().ForMember(x => x.CompanyName, opt => opt.Ignore());
            CreateMap<UserRegisterModel, User>();
        }
    }
}
