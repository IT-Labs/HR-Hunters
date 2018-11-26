using AutoMapper;
using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRHunters.Common;
using HRHunters.Common.DTOs;

namespace HRHunters.WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForLoginDto>();
            CreateMap<User, UserForRegisterDto>();
            CreateMap<UserForRegisterDto, User>();
            CreateMap<User, ClientUserForRegisterDto>().ForMember(dest=> dest.CompanyName, opt => opt.MapFrom(src => src.FirstName));
            CreateMap<ClientUserForRegisterDto, User>().ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.CompanyName));
        }
    }
}
