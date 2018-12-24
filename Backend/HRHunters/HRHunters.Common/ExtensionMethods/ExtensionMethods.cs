using HRHunters.Common.Enums;
using HRHunters.Common.Responses.AdminDashboard;
using HRHunters.Common.ExtensionMethods;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using HRHunters.Common.Entities;
using System.Globalization;
using System.Web;
using HRHunters.Common.Requests;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace HRHunters.Common.ExtensionMethods
{
    public static class ExtensionMethods
    {
        public static IQueryable<T> Applyfilters<T>(this IQueryable<T> a, SearchRequest request)
        {
            //Convert first character from client side to upper to match the model naming convention
            request.SortedBy = char.ToUpper(request.SortedBy[0]) + request.SortedBy.Substring(1);
            request.FilterBy = !string.IsNullOrEmpty(request.FilterBy) ? char.ToUpper(request.FilterBy[0]) + request.FilterBy.Substring(1) : "";
            if (request.FilterBy.Equals("Status"))
                request.FilterQuery = !string.IsNullOrEmpty(request.FilterQuery) ? char.ToUpper(request.FilterQuery[0]) + request.FilterQuery.Substring(1) : "";
            var filter = typeof(T).GetProperty(request.FilterBy);
            if (!string.IsNullOrWhiteSpace(request.FilterBy) && filter != null)
            {
                if (filter.PropertyType.Equals(typeof(int)))
                    a = a.Where(x => (int)filter.GetValue(x, null) == int.Parse((request.FilterQuery)));
                else
                    a = a.Where(x => filter.GetValue(x, null).Equals(request.FilterQuery));

            }
            var sort = typeof(T).GetProperty(request.SortedBy);
            if (request.SortDir == SortDirection.DESC)
            {
                a = a.OrderByDescending(x => sort.GetValue(x, null));
            }
            if (request.SortDir == SortDirection.ASC)
            {
                a = a.OrderBy(x => sort.GetValue(x, null));
            }
            return a.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize);
        }
        
    }
    
        
}
