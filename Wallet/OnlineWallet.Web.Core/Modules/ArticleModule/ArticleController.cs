using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using LinqKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Common.Helpers;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.ArticleModule
{
    [Route("api/v1/[controller]")]
    public class ArticleController : Controller
    {
        private readonly IWalletDbContext _db;

        public ArticleController(IWalletDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public List<ArticleModel> GetBy(string search = "", int limit = 10)
        {
            search = search ?? "";
            search = search.Replace(" ", "");
            var querySearch = search.ToLower().FillWith('%');
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
                e.CreatedAt
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
                    LastPrice = g.OrderByDescending(e => e.CreatedAt).Select(e => e.Value).FirstOrDefault(),
                    NameHighlighted = StringExtensions.Highlight(g.Key, "<strong>", "</strong>", search)
                })
                .OrderByDescending(a => a.Occurence)
                .ToList();
            return result;
        }

    }

    public class ArticleModel
    {
        public string Name { get; set; }
        public string NameHighlighted { get; set; }
        public int Occurence { get; set; }
        public string Category { get; set; }
        public int LastPrice { get; set; }
    }
}
