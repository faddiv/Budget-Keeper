using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Services.Swagger
{
    public class FileDownloadOperationFilter : IOperationFilter
    {
        public void Apply(Operation operation, OperationFilterContext context)
        {
                operation.Produces = new[] { "application/octet-stream" };
                operation.Responses["204"].Schema = new Schema { Type = "file" };
        }
    }
}