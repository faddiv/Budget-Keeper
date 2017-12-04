using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using FluentAssertions;
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

        public static TJsonValue ValidateJsonResult<TJsonValue>(ActionResult actionResult)
        {
            actionResult.Should()
                .NotBeNull().And
                .BeOfType<JsonResult>();

            var jsonResult = (JsonResult)actionResult;
            jsonResult.Value.Should()
                .NotBeNull().And
                .BeOfType<TJsonValue>();

            return (TJsonValue)jsonResult.Value;
        }

        public static void ResultShouldBeBadRequest(ActionResult result)
        {
            result.Should()
                .NotBeNull().And
                .BeOfType(typeof(ContentResult));
            var contentResult = (ContentResult)result;
            contentResult.StatusCode.Should().Be((int)HttpStatusCode.BadRequest);
        }
    }
}
