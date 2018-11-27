using HRHunters.Common.Interfaces;
using HRHunters.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace HRHunters.Domain.Managers
{
    public class BaseManager<TEntity> : IBaseManager<TEntity> where TEntity : class, IEntity
    {
        private readonly IRepository _repo;
        public BaseManager(IRepository repo)
        {
            _repo = repo;
        }
        public void Create(TEntity entity, string createdBy = null)
        {
            _repo.Create(entity, createdBy);
        }

        public void Delete(object id)
        {
            _repo.Delete<TEntity>(id);
        }

        public void Delete(TEntity entity)
        {
            _repo.Delete(entity);
        }

        public IEnumerable<TEntity> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = null, int? skip = null, int? take = null)
        {
            return _repo.Get(filter, orderBy, includeProperties, skip, take);
        }

        public IEnumerable<TEntity> GetAll(Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = null, int? skip = null, int? take = null)
        {
            return _repo.GetAll(orderBy, includeProperties, skip, take);
        }

        public TEntity GetById(object id)
        {
            return _repo.GetById<TEntity>(id);
        }

        public int GetCount(Expression<Func<TEntity, bool>> filter = null)
        {
            return _repo.GetCount(filter);
        }

        public bool GetExists(Expression<Func<TEntity, bool>> filter = null)
        {
            return _repo.GetExists(filter);
        }

        public TEntity GetOne(Expression<Func<TEntity, bool>> filter = null, string includeProperties = null)
        {
            return _repo.GetOne(filter, includeProperties);
        }

        public void Save()
        {
            _repo.Save();
        }

        public void Update(TEntity entity, string modifiedBy = null)
        {
            _repo.Update(entity, modifiedBy);
        }
    }
}
