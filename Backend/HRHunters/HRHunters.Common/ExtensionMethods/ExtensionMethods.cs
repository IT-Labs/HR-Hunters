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

namespace HRHunters.Common.ExtensionMethods
{
    public static class ExtensionMethods
    {
        public static IQueryable<TEntity> WhereIf<TEntity>(this IQueryable<TEntity> source,
            bool condition, Expression<Func<TEntity, bool>> predicate)
        {
            if (condition)
                return source.Where(predicate);
            else
                return source;
        }

        public static string ToPascalCase(this string str)
        {
            string sample = string.Join("", str?.Select(c => Char.IsLetterOrDigit(c) ? c.ToString().ToLower() : "_").ToArray());

            // Split the resulting string by underscore
            // Select first character, uppercase it and concatenate with the rest of the string
            var arr = sample?
                .Split(new[] { '_' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(s => $"{s.Substring(0, 1).ToUpper()}{s.Substring(1)}");

            // Join the resulting collection
            sample = string.Join("", arr);

            return sample;
        }
        public static IQueryable<T> Applyfilters<T>(this IQueryable<T> a, int pageSize = 3, int currentPage = 1, string sortedBy = "Id", SortDirection sortDir = SortDirection.ASC, string filterBy = null, string filterQuery = null)
        {
            //Convert first character from client side to upper to match the model naming convention
            sortedBy = char.ToUpper(sortedBy[0]) + sortedBy.Substring(1);
            filterBy = !string.IsNullOrEmpty(filterBy) ? char.ToUpper(filterBy[0]) + filterBy.Substring(1) : "";
            if(filterBy.Equals("Status"))
                filterQuery = !string.IsNullOrEmpty(filterQuery) ? char.ToUpper(filterQuery[0]) + filterQuery.Substring(1) : "";
            var filter = typeof(T).GetProperty(filterBy);
            if (!string.IsNullOrWhiteSpace(filterBy) && filter != null )
            {
                if (filter.PropertyType.Equals(typeof(int)))                
                    a = a.Where(x => (int)filter.GetValue(x, null) == int.Parse(filterQuery));
               
                else 
                a = a.Where(x => filter.GetValue(x, null).Equals(filterQuery));

            }
            var sort = typeof(T).GetProperty(sortedBy);
            if (sortDir == SortDirection.DESC)
            {
                a = a.OrderByDescending(x => sort.GetValue(x, null));
            }
            if (sortDir == SortDirection.ASC)
            {
                a = a.OrderBy(x => sort.GetValue(x, null));
            }
            return a.Skip((currentPage - 1) * pageSize).Take(pageSize);
        }
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

        public static string GetQueryString(this object obj)
        {
            var properties = from p in obj.GetType().GetProperties()
                             where p.GetValue(obj, null) != null
                             select p.Name + "=" + HttpUtility.UrlEncode(p.GetValue(obj, null).ToString());

            return string.Join("&", properties.ToArray());
        }
    }
    
        
}
