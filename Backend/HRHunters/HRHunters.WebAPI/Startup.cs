using System;
using System.Text;
using Amazon;
using Amazon.Extensions.NETCore.Setup;
using Amazon.S3;
using AutoMapper;
using HRHunters.Common.Constants;
using HRHunters.Common.Entities;
using HRHunters.Common.Responses;
using HRHunters.Data.Context;
using HRHunters.WebAPI.Helpers;
using JwtSwaggerDemo.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using StructureMap;

namespace HRHunters.WebAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }

        //  This method gets called by the runtime.Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {

            IdentityBuilder builder = services.AddIdentity<User, Role>(opt =>
            {
                opt.Password.RequiredLength = 8;
                opt.User.RequireUniqueEmail = true;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase = false;
                opt.Password.RequireDigit = false;
            });
            

            builder = new IdentityBuilder(builder.UserType, typeof(Role), builder.Services);
            builder.AddEntityFrameworkStores<DataContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>();
            builder.AddDefaultTokenProviders();

            services.AddAuthentication(opt =>
            {
                opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(opt => opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                    .GetBytes(EnvironmentVariables.TOKEN)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    SaveSigninToken = true
                });
            services.AddAuthorization();

            services.AddTransient<SeedData>();
            services.AddDbContext<DataContext>(x => x.UseNpgsql(EnvironmentVariables.CONN_STRING));
            services.AddHttpContextAccessor();
            services.AddAutoMapper();
            services.AddCors(opt =>
            {
            opt.AddPolicy("AllowSpecificOrigin",
                buildr =>
                {
                    buildr.WithOrigins("http://dev-docker:9014", "http://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
            });

            var awsOptions = new AWSOptions
            {
                Credentials = new Amazon.Runtime.EnvironmentVariablesAWSCredentials(),
                Region = RegionEndpoint.USWest2
            };
            
            services.AddDefaultAWSOptions(awsOptions);
            services.AddAWSService<IAmazonS3>();
            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.Configure<ApiBehaviorOptions>(options => {
                //Custom ModelState validations through [ApiController] attribute, to match the client's expected response
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    return new BadRequestObjectResult(new GeneralResponse(actionContext.ModelState));
                };
            });
            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerDocumentation();
            var container = new Container();
            
            container.Configure(config =>
            {
                config.AddRegistry(new StructureMapRegistry());
                config.Populate(services);
            });

            return container.GetInstance<IServiceProvider>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, SeedData seeder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwaggerDocumentation();
            }
            else
            {  
                //app.UseHsts();
            }

            //app.UseHttpsRedirection(); 

            
            seeder.EnsureSeedData();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });
            app.UseAuthentication();
            app.UseCors("AllowSpecificOrigin");
            app.UseMvc(routes =>
            {
                routes.MapRoute("default", "{controller=Admin}/{action=Jobs}/{id?}");
            });
        }
    }
}
