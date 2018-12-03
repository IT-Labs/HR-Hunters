using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HRHunters.Common.Responses
{
    public class UserRegisterReturnModel
    {
        public bool Succeeded { get; set; }
        public IDictionary<string, List<string>> Errors { get; set; }

        public UserRegisterReturnModel() { }
        public UserRegisterReturnModel(ModelStateDictionary modelState)
        {
            Errors = new Dictionary<string, List<string>>();
            foreach (var property in modelState.Keys)
            {
                var value = modelState[property];
                var listOfErrors = new List<string>();
                if (value.Errors.Any())
                {
                    foreach (var error in value.Errors)
                    {
                        listOfErrors.Add(error.ErrorMessage);
                    }
                }
                Errors.Add(property, listOfErrors);
            }
        }
    }
}