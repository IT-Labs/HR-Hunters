using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRHunters.Common.CustomValidationAttributes
{
    public class RequiredIfAttribute : ValidationAttribute
    {
        private string PropertyName { get; set; }
        private object DesiredValue { get; set; }
        public RequiredIfAttribute(string propertyName, object desiredvalue, string errormessage)
        {
            PropertyName = propertyName;
            DesiredValue = desiredvalue;
            
        }

        protected override ValidationResult IsValid(object value, ValidationContext context)
        {
            if (value != null) {
                return ValidationResult.Success;
            }
            object instance = context.ObjectInstance;
            Type type = instance.GetType();
            object proprtyvalue = type.GetProperty(PropertyName).GetValue(instance, null);
            if (proprtyvalue == null)
            {
                return new ValidationResult(ErrorMessage);
            }
            return ValidationResult.Success;
        }
    }
}
