using System;
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
            IQueryable<Transaction> transactionQuery = _db.Transactions;
            if (Has(articleNames))
            {
                articleNames = ToLowerDistinct(articleNames);
                var an = articleNames;
                transactionQuery = transactionQuery.Where(e => an.Contains(e.Name.ToLower()));
            }

            var articleOccurences = await transactionQuery
                .GroupBy(e => e.Name.ToLower())
                .Select(e => new
                {
                    Article = e.Key.ToLower(),
                    Occurence = e.Count()
                }).ToListAsync(token);
            IQueryable<Article> articleQuery = _db.Article;
            if (Has(articleNames))
            {
                var an = articleNames;
                articleQuery = articleQuery.Where(e => an.Contains(e.Name.ToLower()));
            }

            var articles = await articleQuery.ToListAsync(token);
            if (!Has(articleNames))
            {
                articleNames = articles.Select(e => e.Name).ToList();
                articleNames = articleNames.Union(articleOccurences.Select(e => e.Article)).ToList();
                articleNames = ToLowerDistinct(articleNames);
            }

            foreach (var articleName in articleNames)
            {
                var occurence = articleOccurences.Find(e => e.Article == articleName)?.Occurence ?? 0;
                var article = articles.Find(e =>
                    string.Equals(e.Name, articleName, StringComparison.InvariantCultureIgnoreCase));
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
                            Name = transaction.Name
                        };
                        try
                        {
                            _db.Article.Add(article);
                        }
                        catch (InvalidOperationException ex)
                        {
                            throw new InvalidOperationException(
                                $"Invalid operation on {articleName} ({transaction.Name})", ex);
                        }
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

        #region  Nonpublic Methods

        private static bool Has(List<string> articleNames)
        {
            return articleNames != null && articleNames.Count > 0;
        }

        private static List<string> ToLowerDistinct(List<string> articleNames)
        {
            return Has(articleNames)
                ? articleNames.Select(e => e.ToLower()).Distinct().ToList()
                : articleNames;
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