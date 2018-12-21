using System;
using System.Collections.Generic;
using System.Text;

namespace HRHunters.Common.Constants
{
    public class EnvironmentVariables
    {
        public static string BUCKET_NAME = Environment.GetEnvironmentVariable("BUCKET_NAME");
        public static string TOKEN = Environment.GetEnvironmentVariable("TOKEN");
        public static string CONN_STRING = Environment.GetEnvironmentVariable("CONN_STRING");
        public static string CLOUD_FRONT_URL = Environment.GetEnvironmentVariable("CLOUD_FRONT_URL");
    }
}
