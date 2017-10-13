using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Common.Swagger
{
    public class ApplyFileUploadOperationFilter : IOperationFilter
    {
        public void Apply(Operation operation, OperationFilterContext context)
        {
            if (context.ApiDescription.ActionDescriptor.Parameters.Count != 1) return;
            var param = context.ApiDescription.ActionDescriptor.Parameters[0];
            if (param.ParameterType != typeof(IFormFile)) return;
            operation.Consumes.Clear();
            operation.Consumes.Add("multipart/form-data");
            operation.Parameters.Clear();
            operation.Parameters.Add(new NonBodyParameter
            {
                Name = param.Name,
                Required = true,
                In = "formData",
                Type = "file"
            }
            );
        }
    }
}