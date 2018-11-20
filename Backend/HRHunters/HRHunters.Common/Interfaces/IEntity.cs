using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public interface IModifiableEntity
    {
        string Name { get; set; }
    }
    public interface IEntity
    {
        object Id { get; }
        DateTime CreatedDate { get; set; }
        DateTime? ModifiedDate { get; set; }
        string CreatedBy { get; set; }
        string ModifiedBy { get; set; }
    }

    public interface IEntity<T> : IEntity
    {
        new T Id { get; set; }
    }
}
