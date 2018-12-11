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

namespace HRHunters.Domain.Managers
{
    public class ClientManager : BaseManager, IClientManager
    {
        private readonly IRepository _repo;
        public ClientManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }
        public ClientResponse GetMultiple(int pageSize = 20, int currentPage = 1, string sortedBy = "", SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "")
        {
            var response = new ClientResponse() { Clients = new List<ClientInfo>()};

            var query = _repo.GetAll<Client>(
                includeProperties: $"{nameof(User)}," +
                                   $"{nameof(Client.JobPostings)}")
                                   .Select(
                                      x => new ClientInfo
                                      {
                                          Id=x.UserId,
                                          CompanyName = x.User.FirstName,
                                          Email = x.User.Email,
                                          Active = x.JobPostings.Count(y=>y.DateTo<DateTime.UtcNow),
                                          AllJobs = x.JobPostings.Count,
                                          Status = x.Status.ToString(),
                                          Logo = "photo"
                                      })
                                      .Applyfilters(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery)
                                      .ToList();
            response.Clients.AddRange(query);
            response.MaxClients = _repo.GetAll<Client>().Count();
            response.Active = _repo.GetCount<Client>(x => x.Status.Equals(ClientStatus.Active));
            response.Inactive= _repo.GetCount<Client>(x => x.Status.Equals(ClientStatus.Inactive));
            return response;

        }

        public IEnumerable<ClientInfo> GetMultiple()
        {
            return _repo.GetAll<Client>(
                includeProperties: $"{nameof(User)}," +
                                   $"{nameof(Client.JobPostings)}")
                                   .Select(
                                      x => new ClientInfo
                                      {
                                          Id=x.UserId,
                                          CompanyName = x.User.FirstName,
                                          Email = x.User.Email,
                                          Active = x.JobPostings.Count(y=>y.DateTo<DateTime.UtcNow),
                                          AllJobs = x.JobPostings.Count,
                                          Status = x.Status.ToString(),
                                          Logo = "photo"
                                      })
                                      .ToList();
        }

        public ClientInfo UpdateClientStatus(int id, string status)
        {
            var client = _repo.GetOne<Client>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(User)},{nameof(Client.JobPostings)}");

            var statusToUpdate = client.Status;
            Enum.TryParse(status, out statusToUpdate);
            client.Status = statusToUpdate;
            _repo.Update(client, "Admin");
            return new ClientInfo
            {
                Id = client.Id,
                CompanyName = client.User.FirstName,
                Email = client.User.Email,
                Location = client.Location,
                Active = client.JobPostings.Count(x => x.DateTo < DateTime.UtcNow),
                AllJobs = client.JobPostings.Count,
                Status = client.Status.ToString(),
                Logo = "Photo"
            };
        }
    }
}
