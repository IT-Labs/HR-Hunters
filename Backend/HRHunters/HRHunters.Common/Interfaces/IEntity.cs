using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Interfaces
{
    public interface IEntity
    {
        int Id { get; }
        DateTime CreatedDate { get; set; }
        DateTime? ModifiedDate { get; set; }
        string CreatedBy { get; set; }
        string ModifiedBy { get; set; }
    }
}
