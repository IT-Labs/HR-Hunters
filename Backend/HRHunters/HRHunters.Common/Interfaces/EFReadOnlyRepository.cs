using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using HRHunters.Common.Enums;

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
        string includeProperties = null)
        where TEntity : Entity
        {
            includeProperties = includeProperties ?? string.Empty;
            IQueryable<TEntity> query = context.Set<TEntity>();
            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }
            if (filter != null)
            {
                query = query.Where(filter);
            }

            

            return query;
        }




        public virtual IQueryable<TEntity> Get<TEntity>(
        Expression<Func<TEntity, bool>> filter = null,
        string orderBy = null,
        string includeProperties = null,
        int? skip = null,
        int? take = null,
        SortDirection? sortDirection = null)
        where TEntity : Entity
        {
           return GetQueryable<TEntity>(filter,includeProperties);
        }

        public virtual IQueryable<TEntity> GetAll<TEntity>(
        string orderBy = null,
        string includeProperties = null,
        int? skip = null,
        int? take = null,
        SortDirection? sortDirection = null)
        where TEntity : Entity
        {
            return GetQueryable<TEntity>(null, includeProperties);
        }

        public virtual TEntity GetById<TEntity>(object id)
        where TEntity : Entity
        {
            return context.Set<TEntity>().Find(id);
        }

        public virtual int GetCount<TEntity>(Expression<Func<TEntity, bool>> filter = null)
        where TEntity : Entity
        {
            return GetQueryable<TEntity>(filter).Count();
        }

        public virtual bool GetExists<TEntity>(Expression<Func<TEntity, bool>> filter = null)
       where TEntity : Entity
        {
            return GetQueryable<TEntity>(filter).Any();
        }

        public virtual TEntity GetOne<TEntity>(
        Expression<Func<TEntity, bool>> filter = null,
        string includeProperties = "")
        where TEntity : Entity
        {
            return GetQueryable<TEntity>(filter, includeProperties).FirstOrDefault();
        }
    }
}
