using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.Common.Swagger;
using OnlineWallet.Web.DataLayer;
using Swashbuckle.AspNetCore.SwaggerGen;
using MoneyDirection = OnlineWallet.ExportImport.MoneyDirection;

namespace OnlineWallet.Web.Modules.ExportExpensesModule
{
    [Route("api/v1/[controller]")]
    public class ExportController : Controller
    {
        private readonly ICsvExportImport _csvExportImport;
        private readonly IWalletDbContext _db;

        public ExportController(ICsvExportImport csvExportImport, IWalletDbContext db)
        {
            _csvExportImport = csvExportImport;
            _db = db;
        }

        [HttpGet]
        [SwaggerOperationFilter(typeof(FileDownloadOperationFilter))]
        public IActionResult FromRange(DateTime from, DateTime to, string fileName)
        {
            from = from.Date;
            to = to.AddDays(1);
           var query = _db.Transactions.Where(e => from <= e.CreatedAt && e.CreatedAt < to)
               .OrderBy(e => e.CreatedAt).ThenBy(e => e.TransactionId)
                .Select(e => new ExportImportRow
                {
                    Name = e.Name,
                    Amount = e.Value,
                    Category = e.Category,
                    Direction = (MoneyDirection)(int)e.Direction,
                    Comment = e.Comment,
                    MatchingId = e.TransactionId,
                    Created = e.CreatedAt,
                    Source = e.Wallet.Name
                });

            using (var stream = new MemoryStream())
            {
                _csvExportImport.ExportTransactions(query, stream);
                return File(stream.ToArray(), "text/csv", Path.ChangeExtension(fileName, "csv"));
            }
        }
    }
}