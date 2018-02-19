using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.TransactionModule.Queries
{
    public class ExportQueries : IExportQueries
    {
        #region Fields

        private readonly ICsvExportImport _csvExportImport;
        private readonly IWalletDbContext _db;

        #endregion

        #region  Constructors

        public ExportQueries(IWalletDbContext db, ICsvExportImport csvExportImport)
        {
            _db = db;
            _csvExportImport = csvExportImport;
        }

        #endregion

        #region  Public Methods

        public async Task ExportIntoFromRangeAsync(Stream stream, DateTime from, DateTime to, CancellationToken token)
        {
            var query = await _db.Transactions.Where(e => from <= e.CreatedAt && e.CreatedAt < to)
                .OrderBy(e => e.CreatedAt).ThenBy(e => e.TransactionId)
                .Select(e => new ExportImportRow
                {
                    Name = e.Name,
                    Amount = e.Value,
                    Category = e.Category,
                    Direction = (MoneyDirection) (int) e.Direction,
                    Comment = e.Comment,
                    MatchingId = e.TransactionId,
                    Created = e.CreatedAt,
                    Source = e.Wallet.Name
                }).ToListAsync(token);

            _csvExportImport.ExportTransactions(query, stream);
        }

        #endregion
    }

    public interface IExportQueries
    {
        #region  Public Methods

        Task ExportIntoFromRangeAsync(Stream stream, DateTime from, DateTime to, CancellationToken token);

        #endregion
    }
}