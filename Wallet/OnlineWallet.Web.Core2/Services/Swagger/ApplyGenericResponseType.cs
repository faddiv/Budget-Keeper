using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using OnlineWallet.Web.Utils;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Services.Swagger
{
    public class ApplyGenericResponseType : IOperationFilter
    {
        #region  Public Methods

        public void Apply(Operation operation, OperationFilterContext context)
        {
            var actionAttributes = GetActionAttributes<SwaggerGenericResponseAttribute>(context.ApiDescription);
            var actionDescriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            if (actionAttributes == null || !actionAttributes.Any())
                return;
            if (actionDescriptor == null)
                return;
            if (operation.Responses == null)
                operation.Responses = new Dictionary<string, Response>();
            foreach (var attribute in actionAttributes)
                ApplyAttribute(operation, context, attribute, actionDescriptor);
        }

        #endregion

        #region  Nonpublic Methods

        private static void ApplyAttribute(Operation operation, OperationFilterContext context,
            SwaggerGenericResponseAttribute attribute, ControllerActionDescriptor actionDescriptor)
        {
            string key = attribute.StatusCode.ToString();
            if (!operation.Responses.TryGetValue(key, out var response))
                response = new Response();
            var type = TypeHelpers.GetGenericArgument(actionDescriptor.ControllerTypeInfo);
            if (attribute.Wrapper != null)
            {
                if (!attribute.Wrapper.IsGenericTypeDefinition || attribute.Wrapper.GenericTypeParameters.Length != 1)
                {
                    throw new Exception("attribute.Wrapper has to be generic type with one argument");
                }
                type = attribute.Wrapper.MakeGenericType(type);
            }
            response.Schema = context.SchemaRegistry.GetOrRegister(type);
            operation.Responses[key] = response;
        }

        private static List<TAttribute> GetActionAttributes<TAttribute>(ApiDescription apiDesc)
        {
            return apiDesc.ControllerAttributes()
                .OfType<TAttribute>()
                .Union(apiDesc.ActionAttributes()
                    .OfType<TAttribute>())
                .ToList();
        }

        #endregion
    }
}