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

namespace HRHunters.Domain.Managers
{
    public class ClientManager : BaseManager, IClientManager
    {
        private readonly IRepository _repo;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        public ClientManager(IRepository repo, UserManager<User> userManager, IMapper mapper) : base(repo)
        {
            _userManager = userManager;
            _mapper = mapper;
            _repo = repo;
        }
        public ClientResponse GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery)
        {
            var response = new ClientResponse() { Clients = new List<ClientInfo>()};

            var queryy = _repo.GetAll<Client>(includeProperties: $"{nameof(User)}," +
                                   $"{nameof(Client.JobPostings)}");
            var selected = _mapper.ProjectTo<ClientInfo>(queryy);
            if (pageSize != 0 && currentPage != 0)
                selected = selected.Applyfilters(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery);

            response.Clients.AddRange(selected.ToList());

            var groupings = _repo.GetAll<Client>().GroupBy(x => x.Status).Select(x => new{ Status = x.Key, Count = x.Count() }).ToList();

            response.MaxClients = groupings.Sum(x => x.Count);
            response.Active = groupings.Where(x => x.Status.Equals(ClientStatus.Active)).Select(x => x.Count).FirstOrDefault();
            response.Inactive = groupings.Where(x => x.Status.Equals(ClientStatus.Inactive)).Select(x => x.Count).FirstOrDefault();

            return response;
        }

        public ClientInfo UpdateClientStatus(int id, string status)
        {
            var client = _repo.GetOne<Client>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(User)},{nameof(Client.JobPostings)}");

            Enum.TryParse(status, out ClientStatus statusToUpdate);
            client.Status = statusToUpdate;
            _repo.Update(client, "Admin");
            return _mapper.Map<ClientInfo>(client);
        }

        public async Task<GeneralResponse> UpdateClientProfile(int id, ClientUpdate clientUpdate)
        {
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
                client.User.ModifiedBy = "User";
                try
                {
                    _repo.Update(client, "User");
                    await _userManager.UpdateAsync(user);
                    return response;
                }
                catch (Exception e)
                {
                    throw new Exception(e.Message);
                }
            }
            var list = new List<string>()
            {
                "Error occured, client-side validation failed."
            };
            response.Errors.Add("Error", list);
            return response;
        }

        public async Task<GeneralResponse> CreateCompany(NewCompany newCompany)
        {
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
