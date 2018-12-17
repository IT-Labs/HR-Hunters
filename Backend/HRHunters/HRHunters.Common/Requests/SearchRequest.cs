using HRHunters.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Requests
{

    public class SearchRequest
    {
        [FromQuery(Name = "pageSize")]
        public int PageSize { get; set; } = 10;
        [FromQuery(Name = "currentPage")]
        public int CurrentPage { get; set; } = 1;
        [FromQuery(Name = "sortedBy")]
        public string SortedBy { get; set; } = "Id";
        [FromQuery(Name = "sortDir")]
        public SortDirection SortDir { get; set; } = SortDirection.ASC;
        [FromQuery(Name = "filterBy")]
        public string FilterBy { get; set; } = "";
        [FromQuery(Name = "filterQuery")]
        public string FilterQuery { get; set; } = "";
        [FromQuery(Name = "id")]
        public int Id { get; set; } = 0;
    }

}
