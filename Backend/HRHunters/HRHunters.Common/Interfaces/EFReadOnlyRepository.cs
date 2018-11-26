using HRHunters.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace HRHunters.Data
{
    public class EFReadOnlyRepository<TContext> : IReadonlyRepository
            where TContext:DbContext
    {
        protected readonly TContext context;

        public EFReadOnlyRepository(TContext context)
        {
            this.context = context;
        }

        protected virtual IQueryable<TEntity> GetQueryable<TEntity>(
        Expression<Func<TEntity, bool>> filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        string includeProperties = null,
        int? skip = null,
        int? take = null)
        where TEntity : class, IEntity
        {
            includeProperties = includeProperties ?? string.Empty;
            IQueryable<TEntity> query = context.Set<TEntity>();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            if (skip.HasValue)
            {
                query = query.Skip(skip.Value);
            }

            if (take.HasValue)
            {
                query = query.Take(take.Value);
            }

            return query;
        }




        public virtual IEnumerable<TEntity> Get<TEntity>(
        Expression<Func<TEntity, bool>> filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        string includeProperties = null,
        int? skip = null,
        int? take = null)
        where TEntity : class, IEntity
        {
           return GetQueryable<TEntity>(filter, orderBy, includeProperties, skip, take).ToList();
        }

        public virtual IEnumerable<TEntity> GetAll<TEntity>(
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        string includeProperties = null,
        int? skip = null,
        int? take = null)
        where TEntity : class, IEntity
        {
            return GetQueryable<TEntity>(null, orderBy, includeProperties, skip, take).ToList();
        }

        public virtual TEntity GetById<TEntity>(object id)
        where TEntity : class, IEntity
        {
            return context.Set<TEntity>().Find(id);
        }

        public virtual int GetCount<TEntity>(Expression<Func<TEntity, bool>> filter = null)
        where TEntity : class, IEntity
        {
            return GetQueryable<TEntity>(filter).Count();
        }

        public virtual bool GetExists<TEntity>(Expression<Func<TEntity, bool>> filter = null)
       where TEntity : class, IEntity
        {
            return GetQueryable<TEntity>(filter).Any();
        }

        public virtual TEntity GetOne<TEntity>(
        Expression<Func<TEntity, bool>> filter = null,
        string includeProperties = "")
        where TEntity : class, IEntity
        {
            return GetQueryable<TEntity>(filter, null, includeProperties).SingleOrDefault();
        }
    }
}
