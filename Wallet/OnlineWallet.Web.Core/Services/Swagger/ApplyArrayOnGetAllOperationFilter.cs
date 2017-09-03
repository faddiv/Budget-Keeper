using System.Linq;
using Microsoft.AspNetCore.Mvc.Controllers;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Services.Swagger
{
    public class ApplyArrayOnGetAllOperationFilter : IOperationFilter
    {
        #region  Public Methods

        public void Apply(Operation operation, OperationFilterContext context)
        {
            var controllerActionDescriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            if (controllerActionDescriptor == null) return;

            var actionName = controllerActionDescriptor.ActionName;
            if (actionName == "GetAll")
            {
                Response response = operation.Responses["200"];
                response.Schema.Type = "array";
                if (response.Schema.Ref != null)
                {
                    response.Schema.Items = new Schema
                    {
                        Ref = response.Schema.Ref
                    };
                    response.Schema.Ref = null;
                }
            }
            if (operation.Parameters != null)
            {
                foreach (var parameter in operation.Parameters.OfType<NonBodyParameter>())
                {
                    if (parameter.Name == "id")
                    {
                        parameter.Type = "number";
                    }
                }
            }
        }

        #endregion
    }
}