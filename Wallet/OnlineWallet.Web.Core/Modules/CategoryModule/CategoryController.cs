using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Common.Helpers;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.CategoryModule
{
    [Route("api/v1/[controller]")]
    public class CategoryController : Controller
    {
        #region Fields

        private readonly IWalletDbContext _db;

        #endregion

        #region  Constructors

        public CategoryController(IWalletDbContext db)
        {
            _db = db;
        }

        #endregion


        [HttpGet]
        public List<CategoryModel> GetBy(string search = "", int limit = 10)
        {
            var querySearch = search.Replace(" ", "").ToLower().FillWith('%');
            var query = _db.Transactions.Where(e => !string.IsNullOrEmpty(e.Category)
             && EF.Functions.Like(e.Category.ToLower(), querySearch));
            var data = query
                .GroupBy(e => e.Category)
                .Take(limit)
                .Select(e => new
                {
                    Name = e.Key,
                    Occurence = e.Count()
                })
                .OrderByDescending(e => e.Occurence)
                .Select(e => new CategoryModel
                {
                    Name = e.Name,
                    NameHighlighted = StringExtensions.Highlight(e.Name, "<strong>", "</strong>", search),
                    Occurence = e.Occurence
                }).ToList();
            return data;
        }
    }
}
