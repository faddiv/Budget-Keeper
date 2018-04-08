using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule.Queries;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Commands
{
    public class ArticleCommands : IArticleCommands
    {
        #region Fields

        private readonly IWalletDbContext _db;
        private readonly ITransactionQueries _transactionQueries;

        #endregion

        #region  Constructors

        public ArticleCommands(IWalletDbContext db, ITransactionQueries transactionQueries)
        {
            _db = db;
            _transactionQueries = transactionQueries;
        }

        #endregion

        #region  Public Methods

        public async Task UpdateArticleStatuses(List<string> articleNames, CancellationToken token)
        {
            var articleOccurences = await _db.Transactions
                .Where(e => articleNames.Contains(e.Name))
                .GroupBy(e => e.Name)
                .Select(e => new
                {
                    Article = e.Key,
                    Occurence = e.Count()
                }).ToListAsync(token);
            var articles = await _db.Article.Where(e => articleNames.Contains(e.Name)).ToListAsync(token);
            foreach (var articleName in articleNames)
            {
                var occurence = articleOccurences.Find(e => e.Article == articleName)?.Occurence ?? 0;
                var article = articles.Find(e => e.Name == articleName);
                if (occurence == 0)
                {
                    if (article != null)
                    {
                        _db.Article.Remove(article);
                    }
                }
                else
                {
                    var transaction = (await _transactionQueries.FetchByArticleAsync(articleName, 1, 0, token))
                        .FirstOrDefault();
                    if (transaction == null)
                        continue;
                    if (article == null)
                    {
                        article = new Article
                        {
                            Name = articleName
                        };
                        _db.Article.Add(article);
                    }

                    article.Category = transaction.Category;
                    article.LastPrice = transaction.Value;
                    article.LastUpdate = transaction.CreatedAt;
                    article.LastWalletId = transaction.WalletId;
                    article.Occurence = occurence;
                }
            }

            await _db.SaveChangesAsync(token);
        }

        #endregion
    }

    public interface IArticleCommands
    {
        #region  Public Methods

        Task UpdateArticleStatuses(List<string> articleNames, CancellationToken token);

        #endregion
    }
}