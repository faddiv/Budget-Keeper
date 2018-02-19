using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Common.Swagger;
using OnlineWallet.Web.Modules.TransactionModule.Queries;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Route("api/v1/[controller]")]
    public class ExportController : Controller
    {
        #region Fields

        private readonly IExportQueries _exportQueries;

        #endregion

        #region  Constructors

        public ExportController(IExportQueries exportQueries)
        {
            _exportQueries = exportQueries;
        }

        #endregion

        #region  Public Methods

        [HttpGet]
        [SwaggerOperationFilter(typeof(FileDownloadOperationFilter))]
        public async Task<IActionResult> FromRange(DateTime from, DateTime to, string fileName,
            CancellationToken token = default(CancellationToken))
        {
            from = from.Date;
            to = to.AddDays(1);
            using (var stream = new MemoryStream())
            {
                await _exportQueries.ExportIntoFromRangeAsync(stream, from, to, token);
                return File(stream.ToArray(), "text/csv", Path.ChangeExtension(fileName, "csv"));
            }
        }

        #endregion
    }
}