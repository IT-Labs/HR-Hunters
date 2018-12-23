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
            For<ITokenGeneration>().LifecycleIs(Lifecycles.Container).Use<TokenGeneration>();
            For<IUsersManager>().LifecycleIs(Lifecycles.Container).Use<UsersManager>();
            For<IS3Manager>().LifecycleIs(Lifecycles.Container).Use<S3Manager>();
            For<IEmailSenderManager>().LifecycleIs(Lifecycles.Container).Use<EmailSenderManager>();
            For<IEmailTemplate>().LifecycleIs(Lifecycles.Container).Use<EmailTemplate>();
            For<IEmailContent>().LifecycleIs(Lifecycles.Container).Use<EmailContent>();
            //var config = new Config
            //{
            //    ConnString = Environment.GetEnvironmentVariable("CONN_STRING"),
            //    Token = Environment.GetEnvironmentVariable("TOKEN"),
            //    BucketName = Environment.GetEnvironmentVariable("BUCKET_NAME")
            //};
            //For<Config>().LifecycleIs(Lifecycles.Singleton).Use(config);
        }
    }
}
