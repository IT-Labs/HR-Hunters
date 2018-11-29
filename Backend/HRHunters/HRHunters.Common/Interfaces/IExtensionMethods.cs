using HRHunters.Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public interface IExtensionMethods
    {
        string GenerateJwtToken(User user);
    }
}
