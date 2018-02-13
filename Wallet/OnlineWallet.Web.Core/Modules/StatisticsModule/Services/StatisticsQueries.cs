using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.StatisticsModule.Models;

namespace OnlineWallet.Web.Modules.StatisticsModule.Services
{
    public class StatisticsQueries : IStatisticsQueries
    {
        private readonly IWalletDbContext _db;

        public StatisticsQueries(IWalletDbContext db)
        {
            _db = db;
        }

        public async Task<BalanceInfo> GetBalanceInfo(int year, int month, CancellationToken token)
        {
            var stats = await _db.Transactions
                .Where(e => e.CreatedAt.Year == year && e.CreatedAt.Month == month)
                .GroupBy(e => e.Direction)
                .Select(e => new
                {
                    Direction = e.Key,
                    Value = e.Sum(r => r.Value)
                })
                .ToAsyncEnumerable()
                .ToLookup(e => e.Direction);
            var balanceInfo = new BalanceInfo
            {
                Income = stats[MoneyDirection.Income].Sum(e => e.Value),
                Spent = stats[MoneyDirection.Expense].Sum(e => e.Value),
                Planned = stats[MoneyDirection.Plan].Sum(e => e.Value),
            };
            return balanceInfo;
        }

        public async Task<CategoryStatisticsSummary> GetCategoriesSummary(int year, CancellationToken token)
        {
            var monthlyStats = await _db.Transactions
                .Where(e => e.CreatedAt.Year == year && e.Direction == MoneyDirection.Expense)
                .GroupBy(e => new { e.CreatedAt.Month, Category = e.Category ?? string.Empty })
                .Select(e => new
                {
                    e.Key.Month,
                    e.Key.Category,
                    Spent = e.Sum(t => t.Value),
                    Count = e.Count()
                })
                .ToAsyncEnumerable()
                .ToLookup(e => e.Month);
            var monthly = new List<List<CategoryStatistics>>();
            for (int i = 0; i < 12; i++)
            {
                var monthlyData = monthlyStats[i + 1].OrderByDescending(e => e.Spent).ToList();
                var categories = new List<CategoryStatistics>();
                foreach (var categoryData in monthlyData)
                {
                    var stats = new CategoryStatistics
                    {
                        Name = categoryData.Category,
                        Count = categoryData.Count,
                        Spent = categoryData.Spent
                    };
                    categories.Add(stats);
                }

                var sumSpent = categories.Sum(e => e.Spent);
                foreach (var item in categories)
                {
                    item.SpentPercent = Math.Round((double)item.Spent / sumSpent, 4, MidpointRounding.AwayFromZero);
                }

                monthly.Add(categories);
            }

            var sumAllSpent = monthly.SelectMany(e => e).Sum(e => e.Spent);
            var yearly = monthly
                .SelectMany(e => e)
                .GroupBy(e => e.Name)
                .Select(e => new CategoryStatistics
                {
                    Name = e.Key,
                    Count = e.Sum(f => f.Count),
                    Spent = e.Sum(f => f.Spent),
                    SpentPercent = Math.Round((double)e.Sum(f => f.Spent) / sumAllSpent, 4,
                        MidpointRounding.AwayFromZero)
                })
                .OrderByDescending(e => e.Spent)
                .ToList();
            return new CategoryStatisticsSummary
            {
                Monthly = monthly,
                Yearly = yearly
            };
        }

        public async Task<YearlyStatistics> GetYearlySummary(int year, CancellationToken token)
        {
            var monthlyStats = await _db.Transactions
                .Where(e => e.CreatedAt.Year == year)
                .GroupBy(e => new { e.CreatedAt.Month, e.Direction })
                .Select(e => new
                {
                    e.Key.Month,
                    e.Key.Direction,
                    Sum = e.Sum(t => t.Value)
                })
                .ToAsyncEnumerable()
                .ToLookup(e => e.Month);
            var monthly = new List<BalanceInfo>();
            for (int i = 0; i < 12; i++)
            {
                var monthlyData = monthlyStats[i + 1].ToList();
                var balanceInfo = new BalanceInfo
                {
                    Income = monthlyData.Where(e => e.Direction == MoneyDirection.Income).Sum(e => e.Sum),
                    Spent = monthlyData.Where(e => e.Direction == MoneyDirection.Expense).Sum(e => e.Sum),
                    Planned = monthlyData.Where(e => e.Direction == MoneyDirection.Plan).Sum(e => e.Sum)
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

    public interface IStatisticsQueries
    {
        Task<BalanceInfo> GetBalanceInfo(int year, int month, CancellationToken token);
        Task<CategoryStatisticsSummary> GetCategoriesSummary(int year, CancellationToken token);
        Task<YearlyStatistics> GetYearlySummary(int year, CancellationToken token);
    }
}
