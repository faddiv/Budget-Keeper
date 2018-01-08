using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Common.Helpers;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.ArticleModule
{
    [Route("api/v1/[controller]")]
    public class ArticleController : Controller
    {
        #region Fields

        private readonly IWalletDbContext _db;

        #endregion

        #region  Constructors

        public ArticleController(IWalletDbContext db)
        {
            _db = db;
        }

        #endregion

        #region  Public Methods

        [HttpGet]
        public List<ArticleModel> GetBy(string search = "", int limit = 10)
        {
            search = search ?? "";
            var querySearch = search.Replace(" ", "").ToLower().FillWith('%');
            var transactionQuery = _db.Transactions
                .Where(e => EF.Functions.Like(e.Name.ToLower(), querySearch));
            var requiredTransactions = transactionQuery.GroupBy(e => e.Name)
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
                .ToList();
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