using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule;

namespace OnlineWallet.Web.Modules.StatisticsModule
{
    public class YearlyStatistics : BalanceInfo
    {
        public List<BalanceInfo> Monthly { get; set; }
    }
}
