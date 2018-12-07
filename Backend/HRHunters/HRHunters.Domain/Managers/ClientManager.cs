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
using System.Collections.Generic;
using System.Linq;

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
            var a = _repo.GetAll<Client>(includeProperties: $"{nameof(Client.User)}"+
                                                            $"{nameof(JobPosting)}.{nameof(JobPosting.Client)}").Select(

                                                            
                  x => new ClientInfo
                  {
                      Id=x.UserId,
                      FirstName = x.User.FirstName,
                      Email = x.User.Email,
                      Location = x.Location,
                      Active = x.JobPostings.Count(y=>y.DateTo<DateTime.UtcNow),
                      All = x.JobPostings.Count,
                      Photo = "photo"
                  });


            var filter = new Filters<ClientInfo>();

            return filter.Applyfilters(a, pageSize, currentPage, sortedBy, sortDir, filterBy, filterQuery);
        }
    }
}
