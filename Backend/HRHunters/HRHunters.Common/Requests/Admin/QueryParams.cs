using HRHunters.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Requests.Admin
{
    public class QueryParams
    {
        public int? PageSize { get; set; }
        public int? CurrentPage { get; set; }
        public string SortedBy { get; set; }
        public SortDirection SortDir { get; set; }

    }
}
