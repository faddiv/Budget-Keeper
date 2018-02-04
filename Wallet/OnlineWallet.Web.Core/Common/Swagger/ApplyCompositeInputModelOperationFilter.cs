using Microsoft.AspNetCore.Mvc.Controllers;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Common.Swagger
{
    public class ApplyCompositeInputModelOperationFilter : IOperationFilter
    {
        #region  Public Methods

        public void Apply(Operation operation, OperationFilterContext context)
        {
            var controllerActionDescriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            if (controllerActionDescriptor == null) return;

            operation.OperationId = controllerActionDescriptor.ActionName;
        }

        #endregion
    }
}