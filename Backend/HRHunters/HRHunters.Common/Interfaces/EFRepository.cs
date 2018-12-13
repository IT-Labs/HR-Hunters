using System;
using System.Collections.Generic;
using System.Text;
using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HRHunters.Data
{
    public class EFRepository<TContext>: EFReadOnlyRepository<TContext>, IRepository
        where TContext: DbContext
    {
        public EFRepository(TContext context) : base(context) { }

        public virtual void Create<TEntity>(TEntity entity, string createdBy = null)
        where TEntity : Entity, IEntity
        {
            entity.CreatedDate = DateTime.UtcNow;
            entity.CreatedBy = createdBy;
            context.Set<TEntity>().Add(entity);
            Save();
        }

        public virtual void Update<TEntity>(TEntity entity, string modifiedBy = null)
            where TEntity : Entity, IEntity
        {
            entity.ModifiedDate = DateTime.UtcNow;
            entity.ModifiedBy = modifiedBy;
            context.Set<TEntity>().Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
            Save();
        }

        public virtual void Delete<TEntity>(object id)
            where TEntity : Entity, IEntity
        {
            TEntity entity = context.Set<TEntity>().Find(id);
            Delete(entity);
            Save();
        }

        public virtual void Delete<TEntity>(TEntity entity)
            where TEntity : Entity, IEntity
        {
            var dbSet = context.Set<TEntity>();
            if (context.Entry(entity).State == EntityState.Detached)
            {
                dbSet.Attach(entity);
                Save();
            }
            dbSet.Remove(entity);
            Save();
        }

        public virtual void Save()
        {
            try
            {
                context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

      
    }
}
