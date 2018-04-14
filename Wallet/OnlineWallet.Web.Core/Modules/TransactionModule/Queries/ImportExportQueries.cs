using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.GeneralDataModule.Queries;

namespace OnlineWallet.Web.Modules.TransactionModule.Queries
{
    public class ImportExportQueries : IImportExportQueries
    {
        #region Fields

        private readonly ICsvExportImport _csvExportImport;
        private readonly ITransactionQueries _transactionQueries;
        private readonly IWalletQueries _walletQueries;

        #endregion

        #region  Constructors

        public ImportExportQueries(ICsvExportImport csvExportImport, ITransactionQueries transactionQueries,
            IWalletQueries walletQueries)
        {
            _csvExportImport = csvExportImport;
            _transactionQueries = transactionQueries;
            _walletQueries = walletQueries;
        }

        #endregion

        #region  Public Methods

        public async Task ExportIntoFromRangeAsync(Stream stream, DateTime from, DateTime to, CancellationToken token)
        {
            var query = (await _transactionQueries.FetchByDateRange(from, to))
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
                })
                .OrderBy(e => e.Created)
                .ThenBy(e => e.Name)
                .ToList();

            _csvExportImport.ExportTransactions(query, stream);
        }

        public async Task<List<ExportImportRow>> ProcessTransactions(Stream input, CancellationToken token)
        {
            var list = _csvExportImport.ImportTransactions(input).ToList();
            if (list.Count == 0) return list;
            var wallets = await _walletQueries.GetAll(token);
            var from = list.Min(e => e.Created);
            var to = list.Max(e => e.Created);
            var directions = ExtractDirections(list);
            var walletIds = ExtractWalletIds(list, wallets);
            var categories = ExtractCategories(list);
            var savedItems =
                await _transactionQueries.FetchByFilters(from, to, directions, walletIds, categories, token);
            foreach (var item in list)
            {
                var wallet = wallets.Find(e => e.Name?.ToLower() == item.Source.ToString().ToLower());
                var index = savedItems.FindIndex(e => e.CreatedAt == item.Created
                                                      && (
                                                          (int) e.Direction == (int) item.Direction &&
                                                          string.Equals(e.Name, item.Name,
                                                              StringComparison.CurrentCultureIgnoreCase)
                                                          || e.WalletId == wallet?.MoneyWalletId &&
                                                          e.Value == item.Amount)
                );
                if (index > -1)
                {
                    var savedItem = savedItems[index];
                    savedItems.RemoveAt(index);
                    item.MatchingId = savedItem.TransactionId;
                }
            }

            return list;
        }

        #endregion

        #region  Nonpublic Methods

        private static List<string> ExtractCategories(List<ExportImportRow> list)
        {
            return list.Select(e => e.Category).Distinct().Select(e => e?.ToLower()).ToList();
        }

        private static List<MoneyDirection> ExtractDirections(List<ExportImportRow> list)
        {
            return list.Select(e => e.Direction).Distinct().Cast<short>().Cast<MoneyDirection>().ToList();
        }

        private static List<int> ExtractWalletIds(List<ExportImportRow> list, List<Wallet> wallets)
        {
            return list.Select(eir => eir.Source).Distinct()
                .Select(walletName => wallets.Find(wallet => wallet.Name?.ToLower() == walletName?.ToString().ToLower())
                    ?.MoneyWalletId)
                .Where(walletId => walletId.HasValue)
                .Select(walletId => walletId.Value)
                .ToList();
        }

        #endregion
    }

    public interface IImportExportQueries
    {
        #region  Public Methods

        Task ExportIntoFromRangeAsync(Stream stream, DateTime from, DateTime to, CancellationToken token);

        Task<List<ExportImportRow>> ProcessTransactions(Stream input, CancellationToken token);

        #endregion
    }
}