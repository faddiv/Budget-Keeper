using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.StatisticsModule
{
    [Route("api/v1/[controller]")]
    public class StatisticsController : Controller
    {
        private readonly IWalletDbContext _db;

        public StatisticsController(IWalletDbContext db)
        {
            _db = db;
        }

        [HttpGet("Yearly/{year}")]
        [SwaggerResponse((int)HttpStatusCode.OK, typeof(YearlyStatistics))]
        public YearlyStatistics Yearly(int year)
        {
            var monthlyStats = _db.Transactions
                .Where(e => e.CreatedAt.Year == year)
                .GroupBy(e => new { e.CreatedAt.Month, e.Direction })
                .Select(e => new
                {
                    e.Key.Month,
                    e.Key.Direction,
                    Sum = e.Sum(t => t.Value)
                }).ToLookup(e => e.Month);
            var monthly = new List<BalanceInfo>();
            for (int i = 0; i < 12; i++)
            {
                var monthlyData = monthlyStats[i + 1].ToList();
                var balanceInfo = new BalanceInfo
                {
                    Income = monthlyData.Where(e => e.Direction == MoneyDirection.Income).Sum(e => e.Sum),
                    Spent = monthlyData.Where(e => e.Direction == MoneyDirection.Expense).Sum(e => e.Sum),
                    Planned = monthlyData.Where(e => e.Direction == MoneyDirection.Plan).Sum(e => e.Sum),
                };
                monthly.Add(balanceInfo);
            }
            return new YearlyStatistics
            {
                Income = monthly.Sum(e => e.Income),
                Spent = monthly.Sum(e => e.Spent),
                Planned = monthly.Sum(e => e.Planned),
                Monthly = monthly
            };
        }
    }
}
