using System.Linq;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule;

namespace OnlineWallet.Web.Modules.StatisticsModule
{
    public class StatisticsController : Controller
    {
        private readonly IWalletDbContext _db;

        public StatisticsController(IWalletDbContext db)
        {
            _db = db;
        }

        public YearlyStatistics Yearly(int year)
        {
            var yearlyStats = _db.Transactions
                .Where(e => e.CreatedAt.Year == year)
                .GroupBy(e => e.Direction)
                .Select(e => new
                {
                    e.Key,
                    Sum = e.Sum(t => t.Value)
                }).ToDictionary(e => e.Key, e => e.Sum);
            yearlyStats.TryGetValue(MoneyDirection.Income, out var income);
            yearlyStats.TryGetValue(MoneyDirection.Expense, out var expense);
            yearlyStats.TryGetValue(MoneyDirection.Plan, out var plan);
            return new YearlyStatistics
            {
                Income = income,
                Spent = expense,
                Planned = plan
            };
        }
    }
}
