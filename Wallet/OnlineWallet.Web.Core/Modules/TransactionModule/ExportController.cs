using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Modules.TransactionModule.Queries;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Route("api/v1/[controller]")]
    public class ExportController : Controller
    {
        #region Fields

        private readonly IImportExportQueries _exportQueries;

        #endregion

        #region  Constructors

        public ExportController(IImportExportQueries exportQueries)
        {
            _exportQueries = exportQueries;
        }

        #endregion

        #region  Public Methods

        [HttpGet]
        public async Task<FileContentResult> FromRange(DateTime from, DateTime to, string fileName,
            CancellationToken token = default(CancellationToken))
        {
            from = from.Date;
            to = to.Date.Add(new TimeSpan(23, 59, 59));
            using (var stream = new MemoryStream())
            {
                await _exportQueries.ExportIntoFromRangeAsync(stream, from, to, token);
                return File(stream.ToArray(), "text/csv", Path.ChangeExtension(fileName, "csv"));
            }
        }

        #endregion
    }
}
