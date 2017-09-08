using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.ExportImport;

namespace OnlineWallet.Web.Modules.ImportExpensesModule
{
    [Route("api/v1/[controller]")]
    public class ImportController : Controller
    {
        #region Fields

        private readonly ICsvExportImport _csvExportImport;

        #endregion

        #region  Constructors

        public ImportController(ICsvExportImport csvExportImport)
        {
            _csvExportImport = csvExportImport;
        }

        #endregion

        #region  Public Methods

        [HttpPost("[action]")]
        public List<ExportImportRow> ProcessTransactions(IFormFile file)
        {
            var list = _csvExportImport.ImportMoneyOperations(file.OpenReadStream()).ToList();
            return list;
        }

        #endregion
    }
}