using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace HRHunters.WebAPI.Helpers
{
    public static class ExtensionMethods
    {
        public static IQueryable<TEntity> OrderBy<TEntity>(this IQueryable<TEntity> query, string orderProperty, bool sortDir)
        {
            string command = sortDir ? "OrderByDescending" : "OrderBy";
            var type = typeof(TEntity);
            var property = type.GetProperty(orderProperty);
            var parameter = Expression.Parameter(type, "p");
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);
            var orderByExpression = Expression.Lambda(propertyAccess, parameter);
            var resultExpression = Expression.Call(typeof(Queryable), command, new Type[] { type, property.PropertyType },
                                          query.Expression, Expression.Quote(orderByExpression));
            return query.Provider.CreateQuery<TEntity>(resultExpression);
        }
    }
}
