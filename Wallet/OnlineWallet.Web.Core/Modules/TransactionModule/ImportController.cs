using Microsoft.AspNetCore.Mvc;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.Modules.TransactionModule.Queries;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Route("api/v1/[controller]")]
    public class ImportController : Controller
    {
        #region Fields

        private readonly IImportExportQueries _importQueries;

        #endregion

        #region  Constructors

        public ImportController(IImportExportQueries importQueries)
        {
            _importQueries = importQueries;
        }

        #endregion

        #region  Public Methods

        [HttpPost("[action]")]
        public async Task<List<ExportImportRow>> ProcessTransactions(IFormFile file,
            CancellationToken token = default(CancellationToken))
        {
            var list = await _importQueries.ProcessTransactions(file.OpenReadStream(), token);
            return list;
        }

        #endregion
    }
}
