using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.Modules.TransactionModule.Queries;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Route("api/v1/[controller]")]
    public class StatisticsController : Controller
    {
        #region Fields

        private readonly IStatisticsQueries _statisticsQueries;

        #endregion

        #region  Constructors

        public StatisticsController(IStatisticsQueries statisticsQueries)
        {
            _statisticsQueries = statisticsQueries;
        }

        #endregion

        #region  Public Methods

        [HttpGet("BalanceInfo")]
        public Task<BalanceInfo> BalanceInfo(int year, int month, CancellationToken token = default(CancellationToken))
        {
            return _statisticsQueries.GetBalanceInfo(year, month, token);
        }

        [HttpGet("Categories")]
        public Task<CategoryStatisticsSummary> Categories(int year,
            CancellationToken token = default(CancellationToken))
        {
            return _statisticsQueries.GetCategoriesSummary(year, token);
        }

        [HttpGet("Yearly")]
        public Task<YearlyStatistics> Yearly(int year, CancellationToken token = default(CancellationToken))
        {
            return _statisticsQueries.GetYearlySummary(year, token);
        }

        #endregion
    }
}
