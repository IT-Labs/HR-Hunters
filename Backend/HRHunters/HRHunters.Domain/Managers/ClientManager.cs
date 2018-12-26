using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Common.ExtensionMethods;
using HRHunters.Data;
using HRHunters.Common.Responses;
using System.Threading.Tasks;
using HRHunters.Common.Requests.Users;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using HRHunters.Common.Requests.Admin;
using HRHunters.Common.Requests;
using HRHunters.Common.Exceptions;
using Microsoft.Extensions.Logging;
using HRHunters.Common.Constants;
using HRHunters.Common.HelperMethods;

namespace HRHunters.Domain.Managers
{
    public class ClientManager : BaseManager, IClientManager
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<ClientManager> _logger;
        private readonly IS3Manager _s3Manager;
        public ClientManager(IRepository repo, UserManager<User> userManager, IMapper mapper, ILogger<ClientManager> logger, IS3Manager s3Manager) : base(repo)
        {
            _logger = logger;
            _userManager = userManager;
            _mapper = mapper;
            _s3Manager = s3Manager;
        }
        public ClientResponse GetMultiple(SearchRequest request)
        {
            var response = new ClientResponse() { Clients = new List<ClientInfo>()};

            var query = GetAll<Client>(includeProperties: $"{nameof(User)}," +
                                   $"{nameof(Client.JobPostings)}");
            var selected = _mapper.ProjectTo<ClientInfo>(query);
            if (request.PageSize != 0 && request.CurrentPage != 0)
                selected = selected.Applyfilters(request);

            response.Clients.AddRange(selected.ToList());

            var groupings = GetAll<Client>().GroupBy(x => x.Status).Select(x => new{ Status = x.Key, Count = x.Count() }).ToList();

            response.MaxClients = groupings.Sum(x => x.Count);
            response.Active = groupings.Where(x => x.Status.Equals(ClientStatus.Active)).Select(x => x.Count).FirstOrDefault();
            response.Inactive = groupings.Where(x => x.Status.Equals(ClientStatus.Inactive)).Select(x => x.Count).FirstOrDefault();

            return response;
        }

        public ClientInfo GetOneClient(int id)
        {
            var query = GetOne<Client>(x => x.Id == id, includeProperties: $"{nameof(User)},{nameof(Client.JobPostings)}");
            return _mapper.Map<ClientInfo>(query);
        }

        public GeneralResponse UpdateClientStatus(int id, ClientStatusUpdate statusUpdate)
        {
            var client = GetOne<Client>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(User)},{nameof(Client.JobPostings)}");
            var response = new GeneralResponse();
            if (client == null)
            {
                response.Errors["Error"].Add(ErrorConstants.NullValue);
            }
            else
            {
                bool statusParse = Enum.TryParse(statusUpdate.Status, out ClientStatus statusToUpdate);

                if (statusParse)
                { 
                    client.Status = statusToUpdate;
                    try
                    {
                        Update(client, RoleConstants.ADMIN);
                        response.Succeeded = true;
                    }catch(Exception e)
                    {
                        _logger.LogError(e.Message, client);
                        response.Errors["Error"].Add(e.Message);
                    }
                }
            }
            return response;
        }

        public async Task<GeneralResponse> UpdateClientProfile(int id, ClientUpdate clientUpdate)
        {
            var response = new GeneralResponse();
            var user = await _userManager.FindByIdAsync(id.ToString());

            var client = GetById<Client>(id);
            client = _mapper.Map(clientUpdate, client);
            client.User.ModifiedDate = DateTime.UtcNow;
            client.User.ModifiedBy = client.User.FirstName;
            var existingUser = await _userManager.FindByEmailAsync(client.User.Email);

            if (existingUser != null && user != existingUser)
            {
                response.Succeeded = false;
                return response.ErrorHandling<ClientManager>("Email is already in use", objects:(existingUser,clientUpdate));
            }

            Update(client, client.User.FirstName);
            await _userManager.UpdateAsync(user);
            response.Succeeded = true;
            return response;
        }

        public async Task<GeneralResponse> UpdateCompanyLogo(FileUpload fileUpload)
        {
            var response = new GeneralResponse();
            var result = await _s3Manager.UploadProfileImage(EnvironmentVariables.BUCKET_NAME, fileUpload);
            if (!result.Succeeded)
            {
                return response.ErrorHandling(ErrorConstants.FailedToUpdateDatabase, _logger, fileUpload);
            }
            var client = GetOne<Client>(x => x.Id == fileUpload.Id, includeProperties: $"{nameof(User)}");
            client.Logo = result.Guid;
            Update(client, client.User.FirstName);
            response.Succeeded = true;
            return response;
        }

        public async Task<GeneralResponse> CreateCompany(NewCompany newCompany)
        {
            var response = new GeneralResponse();

            var user = new User()
            {
                FirstName = newCompany.CompanyName,
                Email = newCompany.Email,
                UserName = newCompany.Email.ToLower()
            };
            var existingUser = await _userManager.FindByEmailAsync(newCompany.Email);
            if (existingUser != null)
                return response.ErrorHandling<ClientManager>("Email already in use", objects: newCompany.Email);

            var result = await _userManager.CreateAsync(user, "ClientDefaultPassword");

            if (!result.Succeeded)
            {
                return response.ErrorHandling(ErrorConstants.FailedToUpdateDatabase, _logger, user);
            }
            var company = new Client()
            {
                User = user,
            };
            company = _mapper.Map(newCompany, company);
            Create(company, RoleConstants.ADMIN);
            response.Succeeded = true;
            return response;
        }
    }
}
