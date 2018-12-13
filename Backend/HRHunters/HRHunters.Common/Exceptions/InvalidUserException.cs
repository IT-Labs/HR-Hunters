using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Exceptions
{
    public class InvalidUserException : Exception
    {
        public string _Message;
        public InvalidUserException(string Message)
        {
            _Message = Message;
        }
    }
}
