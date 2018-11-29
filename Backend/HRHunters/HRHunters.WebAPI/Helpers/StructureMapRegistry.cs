using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using HRHunters.Data;
using HRHunters.Data.Context;
using HRHunters.Domain.Managers;
using StructureMap;
using StructureMap.Pipeline;
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
            For<IRepository>().LifecycleIs(Lifecycles.Container).Use<EFRepository<DataContext>>();
            For<IReadonlyRepository>().LifecycleIs(Lifecycles.Container).Use<EFReadOnlyRepository<DataContext>>();
            For<IBaseManager>().LifecycleIs(Lifecycles.Container).Use<BaseManager>();
            For<IApplicantManager>().LifecycleIs(Lifecycles.Container).Use<ApplicantManager>();
            For<IApplicationManager>().LifecycleIs(Lifecycles.Container).Use<ApplicationManager>();
            For<IClientManager>().LifecycleIs(Lifecycles.Container).Use<ClientManager>();
            For<IJobManager>().LifecycleIs(Lifecycles.Container).Use<JobManager>();
            For<IExtensionMethods>().LifecycleIs(Lifecycles.Container).Use<ExtensionMethods>();
        }
    }
}
