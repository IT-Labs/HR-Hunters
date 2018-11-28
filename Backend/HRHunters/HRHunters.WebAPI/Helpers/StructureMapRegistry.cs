using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Data;
using HRHunters.Data.Context;
using HRHunters.Domain.Managers;
using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRHunters.WebAPI.Helpers
{
    public class StructureMapRegistry : Registry
    {
        public StructureMapRegistry()
        {
            For<IRepository>().Use<EFRepository<DataContext>>();
            For<IReadonlyRepository>().Use<EFReadOnlyRepository<DataContext>>();
            For<ApplicantManager>().Use<ApplicantManager>();
            For<IApplicationManager>().Use<ApplicationManager>();
            For<IClientManager>().Use<ClientManager>();
            For<IJobManager>().Use<JobManager>();
        }
    }
}
