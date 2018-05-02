using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.TransactionModule.Queries
{
    public interface ITransactionQueries
    {
        #region  Public Methods

        Task<List<Transaction>> FetchByArticleAsync(string article, int take = 20, int skip = 0,
            CancellationToken token = default(CancellationToken));

        Task<List<Transaction>> FetchByDateRange(DateTime start, DateTime end,
            CancellationToken token = default(CancellationToken));

        Task<List<Transaction>> FetchByCategory(string category, DateTime? start, DateTime? end,
            int? take, int? skip, CancellationToken token = default(CancellationToken));

        Task<List<Transaction>> FetchByFilters(DateTime start, DateTime end,
            List<MoneyDirection> directions, List<int> walletIds, List<string> categories,
            CancellationToken token = default(CancellationToken));

        #endregion
    }

    public class TransactionQueries : ITransactionQueries
    {
        #region  Constructors

        public TransactionQueries(IWalletDbContext db)
        {
            Db = db;
        }

        #endregion

        #region Properties

        public IWalletDbContext Db { get; }

        #endregion

        #region  Public Methods

        public Task<List<Transaction>> FetchByArticleAsync(string article, int take = 20, int skip = 0,
            CancellationToken token = default(CancellationToken))
        {
            article = article?.ToLower();
            return FetchBy(e => e.Name.ToLower() == article, token, take, skip);
        }

        public Task<List<Transaction>> FetchByDateRange(DateTime start, DateTime end,
            CancellationToken token = default (CancellationToken))
        {
            return FetchBy(e => start <= e.CreatedAt && e.CreatedAt <= end, token);
        }

        public Task<List<Transaction>> FetchByCategory(string category, DateTime? start, DateTime? end,
            int? take, int? skip, CancellationToken token = default(CancellationToken))
        {
            var predicate = PredicateBuilder.New<Transaction>();
            predicate = predicate.Start(e => e.Category.ToLower() == category.ToLower());
            if (start.HasValue)
            {
                predicate = predicate.And(e => start <= e.CreatedAt);
            }
            if (end.HasValue)
            {
                predicate = predicate.And(e => e.CreatedAt <= end);
            }
            return FetchBy(predicate, token, take, skip);
        }

        public Task<List<Transaction>> FetchByFilters(DateTime start, DateTime end,
            List<MoneyDirection> directions, List<int> walletIds, List<string> categories,
            CancellationToken token = default(CancellationToken))
        {
            var query = Db.Transactions.AsNoTracking().Where(e => start <= e.CreatedAt && e.CreatedAt <= end);
            if (directions.Count > 0)
            {
                var predicate = PredicateBuilder.New<Transaction>();
                foreach (var direction in directions)
                {
                    predicate = predicate.Or(e => e.Direction == direction);
                }

                query = query.Where(predicate);
            }

            if (walletIds.Count > 0)
            {
                var predicate = PredicateBuilder.New<Transaction>();
                foreach (var walletId in walletIds)
                {
                    predicate = predicate.Or(e => e.WalletId == walletId);
                }

                query = query.Where(predicate);
            }

            if (categories.Count > 0 && categories.Count < 100)
            {
                var predicate = PredicateBuilder.New<Transaction>();
                foreach (var category in categories)
                {
                    predicate = string.IsNullOrEmpty(category)
                        ? predicate.Or(e => e.Category == null || e.Category == string.Empty)
                        : predicate.Or(e => e.Category.ToLower() == category);
                }

                query = query.Where(predicate);
            }

            return Fetch(query, token);
        }

        #endregion

        #region  Nonpublic Methods

        private Task<List<Transaction>> Fetch(IQueryable<Transaction> query,
            CancellationToken token, int? take = null, int? skip = null)
        {
            query = query
                .OrderByDescending(e => e.CreatedAt)
                .ThenBy(e => e.Name)
                .ThenByDescending(e => e.TransactionId);
            if (skip.HasValue && skip > 0)
            {
                query = query.Skip(skip.Value);
            }

            if (take.HasValue)
            {
                query = query.Take(take.Value);
            }

            return query
                .ToListAsync(token);
        }

        private Task<List<Transaction>> FetchBy(Expression<Func<Transaction, bool>> filter,
            CancellationToken token, int? take = null, int? skip = null)
        {
            return Fetch(Db.Transactions.AsNoTracking().Where(filter), token, take, skip);
        }

        #endregion
    }
}