using HRHunters.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Data
{
    interface IRepository:IReadonlyRepository
    {
        void Create<TEntity>(TEntity entity, string createdBy = null)
        where TEntity : class, IEntity;

        void Update<TEntity>(TEntity entity, string modifiedBy = null)
            where TEntity : class, IEntity;

        void Delete<TEntity>(object id)
            where TEntity : class, IEntity;

        void Delete<TEntity>(TEntity entity)
            where TEntity : class, IEntity;

        void Save();
    }
}
