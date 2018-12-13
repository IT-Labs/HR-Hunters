using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Exceptions
{
    class UnauthorizedAccessException : Exception
    {
        public UnauthorizedAccessException() : base("Unauthorized access to method")
        {

        }
    }
}
