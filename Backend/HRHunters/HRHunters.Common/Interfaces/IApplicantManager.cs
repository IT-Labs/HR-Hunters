using HRHunters.Common.Entities;
using HRHunters.Common.Responses.Applicants;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public  interface IApplicantManager : IBaseManager
    {
        IEnumerable<ApplicantInfo> GetMultiple();
    }
}
