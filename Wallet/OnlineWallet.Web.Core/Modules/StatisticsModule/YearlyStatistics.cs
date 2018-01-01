using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule;

namespace OnlineWallet.Web.Modules.StatisticsModule
{
    public class YearlyStatistics
    {
        public int Spent { get; set; }
        public int Income { get; set; }
        public int Planned { get; set; }

        public int ToSaving => TransactionCalculations.CalculateSavings(Income);
        public int Unused => TransactionCalculations.CalculateUnused(Income, Spent, Planned);

        public List<BalanceInfo> Monthly { get; set; }
    }
}
