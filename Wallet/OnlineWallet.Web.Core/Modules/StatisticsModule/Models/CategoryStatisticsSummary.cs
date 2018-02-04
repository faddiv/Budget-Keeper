using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule;

namespace OnlineWallet.Web.Modules.StatisticsModule
{
    public class CategoryStatisticsSummary
    {
        public List<CategoryStatistics> Yearly { get; set; }
        public List<List<CategoryStatistics>> Monthly { get; set; }
    }
}
