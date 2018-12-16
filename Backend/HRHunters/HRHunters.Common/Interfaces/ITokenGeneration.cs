using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.IdentityModel.Tokens;
using System.Threading.Tasks;

namespace HRHunters.Common.Interfaces
{
    public interface ITokenGeneration
    {
        Task<string> GenerateJwtToken(User user);
    }
}
