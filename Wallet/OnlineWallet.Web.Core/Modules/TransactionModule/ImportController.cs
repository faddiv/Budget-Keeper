using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.Modules.TransactionModule.Commands;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Route("api/v1/[controller]")]
    public class ImportController : Controller
    {
        #region Fields
        
        private readonly IImportCommands _importCommands;

        #endregion

        #region  Constructors

        public ImportController(IImportCommands importCommands)
        {
            _importCommands = importCommands;
        }

        #endregion

        #region  Public Methods

        [HttpPost("[action]")]
        public async Task<List<ExportImportRow>> ProcessTransactions(IFormFile file,
            CancellationToken token = default(CancellationToken))
        {
            var list = await _importCommands.ProcessTransactions(file.OpenReadStream(), token);
            return list;
        }

        #endregion
    }
}