using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.Modules.TransactionModule.Queries;
using Swashbuckle.AspNetCore.SwaggerGen;

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
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(BalanceInfo))]
        public Task<BalanceInfo> BalanceInfo(int year, int month, CancellationToken token = default(CancellationToken))
        {
            return _statisticsQueries.GetBalanceInfo(year, month, token);
        }

        [HttpGet("Categories")]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(CategoryStatisticsSummary))]
        public Task<CategoryStatisticsSummary> Categories(int year,
            CancellationToken token = default(CancellationToken))
        {
            return _statisticsQueries.GetCategoriesSummary(year, token);
        }

        [HttpGet("Yearly")]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(YearlyStatistics))]
        public Task<YearlyStatistics> Yearly(int year, CancellationToken token = default(CancellationToken))
        {
            return _statisticsQueries.GetYearlySummary(year, token);
        }

        #endregion
    }
}