using HRHunters.Common.Entities;
using HRHunters.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Data
{
    public interface IRepository:IReadonlyRepository
    {
        void Create<TEntity>(TEntity entity, string createdBy = null)
        where TEntity : Entity, IEntity;

        void Update<TEntity>(TEntity entity, string modifiedBy = null)
            where TEntity : Entity, IEntity;

        void Delete<TEntity>(object id)
            where TEntity : Entity, IEntity;

        void Delete<TEntity>(TEntity entity)
            where TEntity : Entity, IEntity;

        void Save();
    }
}
