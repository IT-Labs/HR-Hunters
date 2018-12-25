using HRHunters.Common.Responses;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.HelperMethods
{
    public static class HelperMethods
    {
        public static GeneralResponse ErrorHandling<T>(this GeneralResponse response, string error, ILogger<T> logger = null, params object[] objects) where T : class
        {
            logger.LogError(error, objects);
            response.Errors["Error"].Add(error);
            return response;
        }
    }
}
