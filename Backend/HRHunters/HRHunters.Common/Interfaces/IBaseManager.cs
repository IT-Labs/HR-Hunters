using HRHunters.Common.Entities;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public interface IBaseManager
    {       
        void Create<TEntity>(TEntity entity, string createdBy = null) where TEntity : Entity; 

        void Update<TEntity>(TEntity entity, string modifiedBy = null) where TEntity : Entity;

        void Delete<TEntity>(object id) where TEntity : Entity;

        void Delete<TEntity>(TEntity entity) where TEntity : Entity;

        void Save();

        IEnumerable<TEntity> GetAll<TEntity>(Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        string includeProperties = null,
        int? skip = null,
        int? take = null) where TEntity : Entity;

        IEnumerable<TEntity> Get<TEntity>(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        string includeProperties = null,
        int? skip = null,
        int? take = null) where TEntity : Entity;

        TEntity GetOne<TEntity>(
        Expression<Func<TEntity, bool>> filter = null,
        string includeProperties = null) where TEntity : Entity;

        TEntity GetById<TEntity>(object id) where TEntity : Entity;

        int GetCount<TEntity>(Expression<Func<TEntity, bool>> filter = null) where TEntity : Entity;

        bool GetExists<TEntity>(Expression<Func<TEntity, bool>> filter = null) where TEntity : Entity;
    }
}
