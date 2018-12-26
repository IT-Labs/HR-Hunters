using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace HRHunters.Common.Responses
{
    public class S3Response
    {
        public string Guid { get; set; } = null;
        public bool Succeeded { get; set; } = false;
    }
}
