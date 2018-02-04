using System.Collections.Generic;

namespace OnlineWallet.Web.Modules.StatisticsModule.Models
{
    public class CategoryStatisticsSummary
    {
        #region Properties

        public List<List<CategoryStatistics>> Monthly { get; set; }
        public List<CategoryStatistics> Yearly { get; set; }

        #endregion
    }
}