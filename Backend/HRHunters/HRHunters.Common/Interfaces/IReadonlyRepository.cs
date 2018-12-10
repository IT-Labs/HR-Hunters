using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Linq.Expressions;
using System.Text;

namespace HRHunters.Data
{
    public interface IReadonlyRepository
    {
        IQueryable<TEntity> GetAll<TEntity>(string orderBy = null,
        string includeProperties = null,
        int? skip = null,
        int? take = null,
        SortDirection? sortDirection = null)
        where TEntity : Entity;

        IQueryable<TEntity> Get<TEntity>(Expression<Func<TEntity, bool>> filter = null,string orderBy =null,
        string includeProperties = null,
        int? skip = null,
        int? take = null, 
        SortDirection? sortDirection = null)
        where TEntity : Entity;

        TEntity GetOne<TEntity>(
        Expression<Func<TEntity, bool>> filter = null,
        string includeProperties = null)
        where TEntity : Entity;

        TEntity GetById<TEntity>(object id)
        where TEntity : Entity;

        int GetCount<TEntity>(Expression<Func<TEntity, bool>> filter = null)
        where TEntity : Entity;

        bool GetExists<TEntity>(Expression<Func<TEntity, bool>> filter = null)
        where TEntity : Entity;
    }
}
