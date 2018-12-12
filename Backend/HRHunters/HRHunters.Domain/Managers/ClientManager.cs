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
using HRHunters.Common.Requests;
using Microsoft.AspNetCore.Identity;

namespace HRHunters.Domain.Managers
{
    public class ClientManager : BaseManager, IClientManager
    {
        private readonly IRepository _repo;
        public ClientManager(IRepository repo) : base(repo)
        {
            _repo = repo;
        }
        public ClientResponse GetMultiple(int pageSize, int currentPage, string sortedBy, SortDirection sortDir, string filterBy, string filterQuery)
        {
            var response = new ClientResponse() { Clients = new List<ClientInfo>()};
            
            if (pageSize == 0 && currentPage == 0)
            {
                var queryAll = _repo.GetAll<Client>(
                includeProperties: $"{nameof(User)}," +
                                   $"{nameof(Client.JobPostings)}")
                                   .Select(
                                      x => new ClientInfo
                                      {
                                          Id = x.UserId,
                                          CompanyName = x.User.FirstName,
                                          Email = x.User.Email,
                                          Location = x.Location
                                      })
                                      .ToList();
                response.Clients.AddRange(queryAll);
            }
            else
            {
               var query = _repo.GetAll<Client>(
                    includeProperties: $"{nameof(User)}," +
                                       $"{nameof(Client.JobPostings)}")
                                       .Select(
                                          x => new ClientInfo
                                          {
                                              Id = x.UserId,
                                              CompanyName = x.User.FirstName,
                                              Email = x.User.Email,
                                              ActiveJobs = x.JobPostings.Count(y => y.DateTo < DateTime.UtcNow),
                                              AllJobs = x.JobPostings.Count,
                                              Status = x.Status.ToString(),
                                              Logo = "photo"
                                          })
                                          .Applyfilters(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery)
                                          .ToList();
              response.Clients.AddRange(query);
              response.MaxClients = _repo.GetAll<Client>().Count();
              response.Active = _repo.GetCount<Client>(x => x.Status.Equals(ClientStatus.Active));
              response.Inactive = _repo.GetCount<Client>(x => x.Status.Equals(ClientStatus.Inactive));
            }
            return response;
        }

        public ClientInfo UpdateClientStatus(int id, string status)
        {
            var client = _repo.GetOne<Client>(filter: x => x.Id == id,
                                                    includeProperties: $"{nameof(User)},{nameof(Client.JobPostings)}");

            Enum.TryParse(status, out ClientStatus statusToUpdate);
            client.Status = statusToUpdate;
            _repo.Update(client, "Admin");
            return new ClientInfo
            {
                Id = client.Id,
                CompanyName = client.User.FirstName,
                Email = client.User.Email,
                Location = client.Location,
                ActiveJobs = client.JobPostings.Count(x => x.DateTo < DateTime.UtcNow),
                AllJobs = client.JobPostings.Count,
                Status = client.Status.ToString(),
                Logo = "Photo"
            };
        }
    }
}
