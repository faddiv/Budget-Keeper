using System.Linq;
using Microsoft.AspNetCore.Mvc.Controllers;
using OnlineWallet.Web.Utils;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Services.Swagger
{
    public class ApplyCompositeInputModelOperationFilter : IOperationFilter
    {
        public void Apply(Operation operation, OperationFilterContext context)
        {
            var controllerActionDescriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            if (controllerActionDescriptor == null) return;

            operation.OperationId = controllerActionDescriptor.ActionName;
        }
    }
}