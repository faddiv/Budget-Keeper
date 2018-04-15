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

        Task<Article> GetByName(string name, CancellationToken token);
        Task<List<ArticleModel>> SearchByText(string search, int limit, CancellationToken token);

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

        public Task<Article> GetByName(string name, CancellationToken token)
        {
            if (string.IsNullOrEmpty(name))
                return Task.FromResult<Article>(null);
            return _db.Article.FindAsync(name);
        }

        public Task<List<ArticleModel>> SearchByText(string search, int limit, CancellationToken token)
        {
            search = search ?? "";
            var querySearch = search.Replace(" ", "").ToLower().FillWith('%');
            return _db.Article.Where(e => EF.Functions.Like(e.Name.ToLower(), querySearch))
                .OrderByDescending(e => e.Occurence)
                .Take(limit)
                .Select(e => new ArticleModel
                {
                    Name = e.Name,
                    Occurence = e.Occurence,
                    Category = e.Category,
                    LastWallet = e.LastWalletId,
                    LastPrice = e.LastPrice,
                    NameHighlighted = StringExtensions.Highlight(e.Name, "<strong>", "</strong>", search)
                }).ToListAsync(token);
        }

        #endregion
    }
}