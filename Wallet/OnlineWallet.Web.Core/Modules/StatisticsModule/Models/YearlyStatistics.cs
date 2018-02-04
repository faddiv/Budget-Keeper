using System.Collections.Generic;

namespace OnlineWallet.Web.Modules.StatisticsModule.Models
{
    public class YearlyStatistics : BalanceInfo
    {
        #region Properties

        public List<BalanceInfo> Monthly { get; set; }

        #endregion
    }
}