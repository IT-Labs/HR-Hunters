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

namespace HRHunters.Domain.Managers
{
    public class ClientManager : BaseManager, IClientManager
    {
        private readonly IRepository _repo;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<ClientManager> _logger;
        public ClientManager(IRepository repo, UserManager<User> userManager, IMapper mapper, ILogger<ClientManager> logger) : base(repo)
        {
            _logger = logger;
            _userManager = userManager;
            _mapper = mapper;
            _repo = repo;
        }
        public ClientResponse GetMultiple(SearchRequest request, int currentUserId)
        {
            if (currentUserId != request.Id)
            {
                _logger.LogError(Constants.UnauthorizedAccess);
                throw new UnauthorizedAccessException();
            }
            var response = new ClientResponse() { Clients = new List<ClientInfo>()};

            var query = _repo.GetAll<Client>(includeProperties: $"{nameof(User)}," +
                                   $"{nameof(Client.JobPostings)}");
            var selected = _mapper.ProjectTo<ClientInfo>(query);
            if (request.PageSize != 0 && request.CurrentPage != 0)
                selected = selected.Applyfilters(request.PageSize, request.CurrentPage, request.SortedBy, request.SortDir, request.FilterBy, request.FilterQuery);

            response.Clients.AddRange(selected.ToList());

            var groupings = _repo.GetAll<Client>().GroupBy(x => x.Status).Select(x => new{ Status = x.Key, Count = x.Count() }).ToList();

            response.MaxClients = groupings.Sum(x => x.Count);
            response.Active = groupings.Where(x => x.Status.Equals(ClientStatus.Active)).Select(x => x.Count).FirstOrDefault();
            response.Inactive = groupings.Where(x => x.Status.Equals(ClientStatus.Inactive)).Select(x => x.Count).FirstOrDefault();

            return response;
        }

        public ClientInfo GetOneClient(int id)
        {
            var query = _repo.GetOne<Client>(x => x.Id == id, includeProperties: $"{nameof(User)}");
            return _mapper.Map<ClientInfo>(query);
        }

        public GeneralResponse UpdateClientStatus(ClientStatusUpdate clientStatusUpdate)
        {
            var client = _repo.GetOne<Client>(filter: x => x.Id == clientStatusUpdate.Id,
                                                    includeProperties: $"{nameof(User)},{nameof(Client.JobPostings)}");
            var response = new GeneralResponse()
            {
                Succeeded = true,
                Errors = new Dictionary<string, List<string>>()
            };
            if (client == null)
            {
                response.Errors.Add("Error", new List<string>() { "Invalid id." });
                response.Succeeded = false;

            }
            else
            {
                Enum.TryParse(clientStatusUpdate.Status, out ClientStatus statusToUpdate);
                client.Status = statusToUpdate;
                _repo.Update(client, "Admin");
            }
            return response;
        }

        public async Task<GeneralResponse> UpdateClientProfile(int id, ClientUpdate clientUpdate,int currentUserId)
        {
            if (currentUserId != id)
            {
                throw new InvalidUserException("Invalid user id");
            }

            var response = new GeneralResponse()
            {
                Succeeded = true,
                Errors = new Dictionary<string, List<string>>()
            };
            var user = await _userManager.FindByIdAsync(id.ToString());

            var client = _repo.GetById<Client>(id);
            if (user != null && clientUpdate != null)
            {
                client = _mapper.Map(clientUpdate, client);
                client.User.ModifiedDate = DateTime.UtcNow;
                client.User.ModifiedBy = client.User.FirstName;
                var exists = await _userManager.FindByEmailAsync(client.User.Email);
                if (exists != null)
                {
                    response.Succeeded = false;
                    response.Errors.Add("Error", new List<string> { "Email is already in use" });
                    return response;
                }
                try
                {
                    _repo.Update(client, client.User.FirstName);
                    await _userManager.UpdateAsync(user);
                    return response;
                }
                catch (Exception e)
                {
                    throw new Exception(e.Message);
                }
            }           
            
            return response;
        }

        public async Task<GeneralResponse> CreateCompany(NewCompany newCompany,int currentUserId)
        {
            var currentUser = await _userManager.FindByIdAsync(currentUserId.ToString());
            var roles = await _userManager.GetRolesAsync(currentUser);
            if (!roles.Contains("Admin"))
            {
                throw new InvalidUserException("Invalid user");
            }
            var response = new GeneralResponse()
            {
                Succeeded = true,
                Errors = new Dictionary<string, List<string>>()
            };
            var user = new User()
            {
                FirstName = newCompany.CompanyName,
                Email = newCompany.Email,
                UserName = newCompany.Email.ToLower()
            };
            var result = await _userManager.CreateAsync(user, "ClientDefaultPassword");
            //TODO: Notify client with email
            if (!result.Succeeded)
            {
                response.Errors.Add("Error", new List<string>() { "Failed to create user." });
                return response;
            }
            var company = new Client()
            {
                User = user,
            };
            company = _mapper.Map(newCompany, company);
            try
            {
                _repo.Create(company, "Admin");
                return response;
            }
            catch
            {
                response.Errors.Add("Error", new List<string>() { "Failed to create company." });
                return response;
            }


        }
    }
}
