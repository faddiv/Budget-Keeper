using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Services.Swagger
{
    public class ApplyGenericResponseType :  IOperationFilter
    {
        private static List<TAttribute> GetActionAttributes<TAttribute>(ApiDescription apiDesc)
        {
            return apiDesc.ControllerAttributes()
                .OfType<TAttribute>()
                .Union(apiDesc.ActionAttributes()
                    .OfType<TAttribute>())
                .ToList();
        }
        public void Apply(Operation operation, OperationFilterContext context)
        {
            var actionAttributes = GetActionAttributes<SwaggerGenericResponseAttribute>(context.ApiDescription);
            var actionDescriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;
            if (actionAttributes == null || !Enumerable.Any<SwaggerGenericResponseAttribute>(actionAttributes))
                return;
            if (actionDescriptor == null)
                return;
            if (operation.Responses == null)
                operation.Responses = new Dictionary<string, Response>();
            foreach (var attribute in actionAttributes)
                ApplyAttribute(operation, context, attribute, actionDescriptor);
        }

        private static void ApplyAttribute(Operation operation, OperationFilterContext context, SwaggerGenericResponseAttribute attribute, ControllerActionDescriptor actionDescriptor)
        {
            string key = attribute.StatusCode.ToString();
            Response response;
            if (!operation.Responses.TryGetValue(key, out response))
                response = new Response();
            var type = GetGenericArgument(actionDescriptor.ControllerTypeInfo);
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

        private static Type GetGenericArgument(TypeInfo typeInfo)
        {
            while (true)
            {
                if (typeInfo == null)
                    return null;
                if (typeInfo.IsGenericType)
                    return typeInfo.GenericTypeArguments.FirstOrDefault();
                if (typeInfo.BaseType == null)
                    return null;
                typeInfo = typeInfo.BaseType.GetTypeInfo();
            }
        }
    }
}