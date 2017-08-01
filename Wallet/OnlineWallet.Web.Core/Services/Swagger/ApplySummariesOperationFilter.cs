using System;
using System.Collections;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Controllers;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Services.Swagger
{
    public class ApplySummariesOperationFilter : IOperationFilter
    {
        public void Apply(Operation operation, OperationFilterContext context)
        {
            var controllerActionDescriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            if (controllerActionDescriptor == null) return;

            var actionName = controllerActionDescriptor.ActionName;
            var resourceName = controllerActionDescriptor.ControllerName.TrimEnd('s');

            if (actionName == "Post")
            {
                operation.Summary = $"Creates a {resourceName}";
                operation.Parameters[0].Description = $"a {resourceName} representation";
            }
            else if (actionName == "GetAll")
            {
                operation.Summary = $"Returns all {resourceName}s";
            }
            else if (actionName == "GetById")
            {
                operation.Summary = $"Retrieves a {resourceName} by unique id";
            }
            else if (actionName == "Put")
            {
                operation.Summary = $"Updates a {resourceName} by unique id";
                operation.Parameters[0].Description = $"a unique id for the {resourceName}";
                operation.Parameters[1].Description = $"a {resourceName} representation";
            }
            else if (actionName == "Delete")
            {
                operation.Summary = $"Deletes a {resourceName} by unique id";
                operation.Parameters[0].Description = $"a unique id for the {resourceName}";
            }
        }
    }

    public class ApplyArrayOnGetAllOperationFilter : IOperationFilter
    {
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
    }

}
