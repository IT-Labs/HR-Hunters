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
        public ClientManager(IRepository repo, UserManager<User> userManager, IMapper mapper, ILogger<ClientManager> logger) : base(repo)
        {
            _logger = logger;
            _userManager = userManager;
            _mapper = mapper;
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
            var query = GetOne<Client>(x => x.Id == id, includeProperties: $"{nameof(User)}");
            return _mapper.Map<ClientInfo>(query);
        }

        public GeneralResponse UpdateClientStatus(ClientStatusUpdate clientStatusUpdate)
        {
            var client = GetOne<Client>(filter: x => x.Id == clientStatusUpdate.Id,
                                                    includeProperties: $"{nameof(User)},{nameof(Client.JobPostings)}");
            var response = new GeneralResponse();
            if (client == null)
            {
                response.Errors["Error"].Add(ErrorConstants.NullValue);
            }
            else
            {
                bool statusParse = Enum.TryParse(clientStatusUpdate.Status, out ClientStatus statusToUpdate);

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

        public async Task<GeneralResponse> UpdateClientProfile(int id, ClientUpdate clientUpdate,int currentUserId)
        {
            var response = new GeneralResponse();
            if (currentUserId != id)
            {
                return response.ErrorHandling(ErrorConstants.UnauthorizedAccess, _logger, id, currentUserId);
            }

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
            try
            {
                Update(client, client.User.FirstName);
                await _userManager.UpdateAsync(user);
                response.Succeeded = true;
                return response;
            }
            catch(Exception e)
            {
                return response.ErrorHandling(e.Message, _logger, client);
            }
        }

        public async Task<GeneralResponse> CreateCompany(NewCompany newCompany,int currentUserId)
        {
            var currentUser = await _userManager.FindByIdAsync(currentUserId.ToString());
            var roles = await _userManager.GetRolesAsync(currentUser);
            var response = new GeneralResponse();

            var user = new User()
            {
                FirstName = newCompany.CompanyName,
                Email = newCompany.Email,
                UserName = newCompany.Email.ToLower()
            };
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
            try
            {
                Create(company, RoleConstants.ADMIN);
                response.Succeeded = true;
                return response;
            }
            catch(Exception e)
            {
                return response.ErrorHandling(e.Message, _logger, company);
            }
        }
    }
}
