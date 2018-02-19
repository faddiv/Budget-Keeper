using OnlineWallet.Web.Modules.TransactionModule.Models;

namespace OnlineWallet.Web.Modules.StatisticsModule
{
    static class CategoryStatExtensions
    {
        public static CategoryStatistics YearlyByName(this CategoryStatisticsSummary summ, string name)
        {
            return summ.Yearly.Find(e => e.Name == name);
        }
    }
}
