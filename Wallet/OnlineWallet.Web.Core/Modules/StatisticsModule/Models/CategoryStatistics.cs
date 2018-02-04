using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule;

namespace OnlineWallet.Web.Modules.StatisticsModule
{
    public class CategoryStatistics
    {
        public string Name { get; set; }
        public int Count { get; set; }
        public int Spent { get; set; }
        public double SpentPercent { get; set; }
    }
}
