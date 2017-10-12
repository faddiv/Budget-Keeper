using System;
using System.Collections.Generic;
using System.Linq;
using LinqKit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.ImportExpensesModule
{
    [Route("api/v1/[controller]")]
    public class ImportController : Controller
    {
        #region Fields

        private readonly ICsvExportImport _csvExportImport;
        private readonly IWalletDbContext _db;

        #endregion

        #region  Constructors

        public ImportController(ICsvExportImport csvExportImport, IWalletDbContext db)
        {
            _csvExportImport = csvExportImport;
            _db = db;
        }

        #endregion

        #region  Public Methods

        [HttpPost("[action]")]
        public List<ExportImportRow> ProcessTransactions(IFormFile file)
        {
            var list = _csvExportImport.ImportTransactions(file.OpenReadStream()).ToList();
            if (list.Count == 0) return list;
            var from = list.Min(e => e.Created);
            var to = list.Max(e => e.Created);
            var directions = list.Select(e => e.Direction).Distinct().Cast<short>().Cast<MoneyDirection>().ToList();
            var sources = list.Select(e => e.Source).Distinct().ToList();
            var categories = list.Select(e => e.Category).Distinct().Select(e => e?.ToLower()).ToList();
            var query = _db.Transactions.AsNoTracking().Where(e => from <= e.CreatedAt && e.CreatedAt <= to);
            var wallets = _db.Wallets.AsNoTracking().ToList();
            if (directions.Count > 0)
            {
                var predicate = PredicateBuilder.New<Transaction>();
                foreach (var direction in directions)
                {
                    predicate = predicate.Or(e => e.Direction == direction);
                }
                query = query.Where(predicate);
            }
            if (sources.Count > 0)
            {
                var predicate = PredicateBuilder.New<Transaction>();
                foreach (var source in sources)
                {
                    var wallet = wallets.Find(e => e.Name?.ToLower() == source.ToString().ToLower());
                    if (wallet == null) continue;
                    predicate = predicate.Or(e => e.Wallet == wallet);
                }
                query = query.Where(predicate);
            }
            if (categories.Count > 0 && categories.Count < 100)
            {
                var predicate = PredicateBuilder.New<Transaction>();
                foreach (var category in categories)
                {
                    if (string.IsNullOrEmpty(category))
                    {
                        predicate = predicate.Or(e => e.Category == null || e.Category == string.Empty);
                    }
                    else
                    {
                        predicate = predicate.Or(e => e.Category.ToLower() == category);
                    }
                }
                query = query.Where(predicate);
            }
            var savedItems = query.OrderBy(e => e.TransactionId).ToList();
            foreach (var item in list)
            {
                var wallet = wallets.Find(e => e.Name?.ToLower() == item.Source.ToString().ToLower());
                var index = savedItems.FindIndex(e => e.CreatedAt == item.Created
                                                       && (
                                                       ((int) e.Direction == (int) item.Direction && string.Equals(e.Name, item.Name, StringComparison.CurrentCultureIgnoreCase))
                                                       || (e.WalletId == wallet?.MoneyWalletId && e.Value == item.Amount))
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
    }
}