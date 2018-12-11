using HRHunters.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Requests
{
    public class SearchRequest
    {
        public int PageSize = 10;
        public int CurrentPage = 1;
        public string SortedBy = "Id";
        public SortDirection SortDir = SortDirection.ASC;
        public string FilterBy = "";
        public string FilterQuery = "";
    }
}
