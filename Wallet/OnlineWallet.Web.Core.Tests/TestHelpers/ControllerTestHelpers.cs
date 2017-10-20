using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace OnlineWallet.Web.TestHelpers
{
    public class ControllerTestHelpers
    {
        public static void AddModelErrorsFrom(object model, Controller controller)
        {
            var validationResults = new List<ValidationResult>();
            ValidationContext validationContext = new ValidationContext(model);
            if (!Validator.TryValidateObject(model, validationContext, validationResults, true))
            {
                foreach (var item in validationResults)
                {
                    foreach (var member in item.MemberNames)
                    {
                        controller.ModelState.AddModelError(member, item.ErrorMessage);
                    }
                }
            }
        }
    }
}
