using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HRHunters.Common.Responses
{
    public class GeneralResponse
    {
        public bool Succeeded { get; set; }
        public IDictionary<string, List<string>> Errors { get; set; }
        public GeneralResponse()
        {
            Succeeded = false;
            Errors = new Dictionary<string, List<string>>
            {
                { "Error", new List<string>() }
            };
        }
        public GeneralResponse(ModelStateDictionary modelState)
        {
            Errors = new Dictionary<string, List<string>>();
            var listOfErrors = new List<string>();
            foreach (var property in modelState.Keys)
            {
                var value = modelState[property];
                if (value.Errors.Any())
                {
                    foreach (var error in value.Errors)
                    {
                        listOfErrors.Add(error.ErrorMessage);
                    }
                }
            }

            Errors.Add("Error", listOfErrors);
        }
    }
}