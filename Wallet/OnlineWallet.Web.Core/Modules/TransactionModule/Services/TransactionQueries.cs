using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    public interface ITransactionQueries
    {
        Task<List<Transaction>> FetchByArticleAsync(string article, int take = 20,
            CancellationToken token = default(CancellationToken));

        Task<List<Transaction>> FetchByDateRange(DateTime start, DateTime end,
            CancellationToken token = default(CancellationToken));
    }

    public class TransactionQueries : ITransactionQueries
    {
        public TransactionQueries(IWalletDbContext db)
        {
            Db = db;
        }

        public IWalletDbContext Db { get; }

        public Task<List<Transaction>> FetchByArticleAsync(string article, int take = 20,
            CancellationToken token = default(CancellationToken))
        {
            return FetchBy(e => e.Name == article, token, take);
        }

        public Task<List<Transaction>> FetchByDateRange(DateTime start, DateTime end,
            CancellationToken token = default(CancellationToken))
        {
            return FetchBy(e => start <= e.CreatedAt && e.CreatedAt <= end, token);
        }

        private Task<List<Transaction>> FetchBy(Expression<Func<Transaction, bool>> filter,
            CancellationToken token, int? take = null, int? skip = null)
        {
            IQueryable<Transaction> query = Db.Transactions
                   .Where(filter)
                   .OrderByDescending(e => e.CreatedAt)
                   .ThenBy(e => e.Name)
                   .ThenByDescending(e => e.TransactionId);
            if (skip.HasValue)
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
    }
}
