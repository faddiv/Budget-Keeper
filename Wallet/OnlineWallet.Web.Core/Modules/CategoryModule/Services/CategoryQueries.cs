using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Common.Helpers;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.CategoryModule.Models;

namespace OnlineWallet.Web.Modules.CategoryModule.Services
{
    public class CategoryQueries : ICategoryQueries
    {
        private readonly IWalletDbContext _db;

        public CategoryQueries(IWalletDbContext db)
        {
            _db = db;
        }

        public async Task<List<CategoryModel>> GetBySearchText(string search, int limit)
        {
            var querySearch = search.Replace(" ", "").ToLower().FillWith('%');
            var query = _db.Transactions.Where(e => !string.IsNullOrEmpty(e.Category)
                                                    && EF.Functions.Like(e.Category.ToLower(), querySearch));
            var data = await query
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
                }).ToListAsync();
            return data;
        }
    }

    public interface ICategoryQueries
    {
        Task<List<CategoryModel>> GetBySearchText(string search, int limit);
    }
}
