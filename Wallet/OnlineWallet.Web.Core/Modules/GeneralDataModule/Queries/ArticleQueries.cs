using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Common.Helpers;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.GeneralDataModule.Models;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Queries
{
    public interface IArticleQueries
    {
        #region  Public Methods

        Task<List<ArticleModel>> GetByText(string search, int limit, CancellationToken token);

        #endregion
    }

    public class ArticleQueries : IArticleQueries
    {
        #region Fields

        private readonly IWalletDbContext _db;

        #endregion

        #region  Constructors

        public ArticleQueries(IWalletDbContext db)
        {
            _db = db;
        }

        #endregion

        #region  Public Methods

        public async Task<List<ArticleModel>> GetByText(string search, int limit, CancellationToken token)
        {
            search = search ?? "";
            var querySearch = search.Replace(" ", "").ToLower().FillWith('%');
            var transactionQuery = _db.Transactions
                .Where(e => EF.Functions.Like(e.Name.ToLower(), querySearch));
            var requiredTransactions = await transactionQuery
                .GroupBy(e => e.Name)
                .OrderByDescending(a => a.Count())
                .Take(limit)
                .SelectMany(g => g.Select(e => new
                {
                    e.Name,
                    e.Category,
                    e.Value,
                    e.CreatedAt,
                    e.WalletId
                }))
                .ToListAsync(token);
            var result = requiredTransactions
                .GroupBy(e => e.Name)
                .Select(g => new ArticleModel
                {
                    Name = g.Key,
                    Occurence = g.Count(),
                    Category = g.Where(c => c.Category != null)
                        .GroupBy(c => c.Category)
                        .OrderByDescending(c => c.Count())
                        .Select(c => c.Key).FirstOrDefault(),
                    LastWallet = g.OrderByDescending(e => e.CreatedAt).Select(e => e.WalletId).FirstOrDefault(),
                    LastPrice = g.OrderByDescending(e => e.CreatedAt).Select(e => e.Value).FirstOrDefault(),
                    NameHighlighted = StringExtensions.Highlight(g.Key, "<strong>", "</strong>", search)
                })
                .OrderByDescending(a => a.Occurence)
                .ToList();
            return result;
        }

        #endregion
    }
}