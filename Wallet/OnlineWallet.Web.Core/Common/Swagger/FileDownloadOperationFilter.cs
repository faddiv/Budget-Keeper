using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Common.Swagger
{
    public class FileDownloadOperationFilter : IOperationFilter
    {
        #region  Public Methods

        public void Apply(Operation operation, OperationFilterContext context)
        {
            operation.Produces = new[] {"application/octet-stream"};
            operation.Responses["200"].Schema = new Schema {Type = "file"};
        }

        #endregion
    }
}