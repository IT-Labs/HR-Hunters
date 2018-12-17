using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Exceptions
{
    class UnauthorizedAccessException : Exception
    {
        public new string Message { get; set; }
     
        public UnauthorizedAccessException()
        {
            Message = "Unauthorized access";
        }
    }
}
