using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.TransactionModule.Services
{
    public interface ITransactionQueries
    {
        #region  Public Methods

        Task<List<Transaction>> FetchByArticleAsync(string article, int take = 20, int skip = 0,
            CancellationToken token = default(CancellationToken));

        Task<List<Transaction>> FetchByDateRange(DateTime start, DateTime end,
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
            return FetchBy(e => e.Name == article, token, take, skip);
        }

        public Task<List<Transaction>> FetchByDateRange(DateTime start, DateTime end,
            CancellationToken token = default(CancellationToken))
        {
            return FetchBy(e => start <= e.CreatedAt && e.CreatedAt <= end, token);
        }

        #endregion

        #region  Nonpublic Methods

        private Task<List<Transaction>> FetchBy(Expression<Func<Transaction, bool>> filter,
            CancellationToken token, int? take = null, int? skip = null)
        {
            IQueryable<Transaction> query = Db.Transactions
                .Where(filter)
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

        #endregion
    }
}