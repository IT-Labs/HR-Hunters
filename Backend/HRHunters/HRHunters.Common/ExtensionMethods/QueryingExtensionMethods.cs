using HRHunters.Common.Enums;
using HRHunters.Common.Responses.AdminDashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace HRHunters.Common.ExtensionMethods
{
    public static class QueryingExtensionMethods
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
    }
    public class Filters<T>
    {
        public IEnumerable<T> Applyfilters(IEnumerable<T> a, int pageSize = 20, int currentPage = 1, string sortedBy="Id" , SortDirection sortDir = SortDirection.ASC, string filterBy = "", string filterQuery = "")
        {
            if (!string.IsNullOrWhiteSpace(sortedBy))
            {
                var pi = typeof(T).GetProperty(sortedBy);
                if (sortDir == SortDirection.DESC)
                {
                    a = a.OrderByDescending(x => pi.GetValue(x, null));
                }
                if (sortDir == SortDirection.ASC)
                {
                   a = a.OrderBy(x => pi.GetValue(x, null));
                }
            }

            if (!string.IsNullOrWhiteSpace(filterBy))
            {

                var pi = typeof(T).GetProperty(filterBy);
                a = a.Where(x => pi.GetValue(x, null).Equals(filterQuery));

            }
            return a.Skip((currentPage - 1) * pageSize).Take(pageSize);
        }
    }
}
