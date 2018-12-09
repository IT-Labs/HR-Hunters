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
        public IEnumerable<ClientInfo> GetMultiple(int pageSize = 20, int currentPage = 1, string sortedBy = "", SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "")
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
                                      .Applyfilters(pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery)
                                      .ToList();
        }
    }
}
