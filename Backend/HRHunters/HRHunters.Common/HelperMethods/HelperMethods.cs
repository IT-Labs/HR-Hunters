using CsvHelper;
using HRHunters.Common.Constants;
using HRHunters.Common.Entities;
using HRHunters.Common.Enums;
using HRHunters.Common.Responses;
using HRHunters.Common.Responses.AdminDashboard;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
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
        public static CSVResponse ValidateCSV(IFormFile formFile)
        {
            var result = new CSVResponse()
            {
                Response = new GeneralResponse(),
                Jobs = new List<JobPosting>()
            };                          
          
            var format = ValidateFormat(formFile);
            if (format.Errors["Error"].Any())
            {
                result.Response = format;
                return result;
            }
            var content = ProcessCSV(formFile);
            if (content.Response.Errors["Error"].Any())
            {
                result.Response = content.Response;
            }
            result.Jobs = content.Jobs;
            return result;
        }

        public static GeneralResponse ValidateFormat(IFormFile formFile)
        {
            var validation = new GeneralResponse();

            if (formFile == null || formFile.Length == 0)
            {
                validation.Errors["Error"].Add("Please insert a valid csv file");
                return validation;
            }

            if (formFile.ContentType != "application/vnd.ms-excel" && formFile.ContentType != "application/octet-stream")
            {
                validation.Errors["Error"].Add(ErrorConstants.InvalidFormat);
            }
            return validation;

        }
        public static CSVResponse ProcessCSV(IFormFile formFile)
        {
            var validation = new CSVResponse()
            {
                Response = new GeneralResponse(),
                Jobs = new List<JobPosting>()
            };
            var formats = new string[] { "dd-MM-yy", "dd.MM.yy", "dd/MM/yy" };
            var reader = new StreamReader(formFile.OpenReadStream());
            var iteration = 1;

            var csv = new CsvReader(reader);
            csv.Configuration.Delimiter = ",";

            while (csv.Read())
            {
                csv.ReadHeader();
                var headers = csv.Context.HeaderRecord.ToList();
                if (iteration == 1)
                {
                    if (!headers.SequenceEqual(ConstantStrings.HEADERS))
                    {
                        validation.Response.Errors["Error"].Add("The header columns must in the following order: Title, Description, Type, Education, Experience, DateFrom, DateTo ");
                    }
                    iteration++;
                    continue;
                }
                try
                {
                    bool dateFromParse = DateTime.TryParseExact(csv[5].ToString(), formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime dateFrom);
                    bool dateToParse = DateTime.TryParseExact(csv[6].ToString(), formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime dateTo);

                    if (csv[0].Length > 30 || csv[0].Length == 0 || csv[1].Length > 800 || !dateFromParse || !dateToParse)
                    {
                        validation.Response.Errors["Error"].Add(ErrorConstants.InvalidInput + " at line " + iteration);
                    }
                    var _Job = new JobPosting()
                    {
                        Title = csv[0],
                        Description = csv[1],
                        EmpCategory = Enum.Parse<JobType>(csv[2].ToString()),
                        Education = Enum.Parse<EducationType>(csv[3].ToString()),
                        NeededExperience = csv[4],
                        DateFrom = dateFrom,
                        DateTo = dateTo
                    };


                    validation.Jobs.Add(_Job);
                    iteration++;
                }
                catch
                {
                    validation.Response.Errors["Error"].Add(ErrorConstants.InvalidFormat + " at line " + iteration);
                    return validation;
                }
            }
            return validation;
        }
    }
}
