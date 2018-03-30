using OnlineWallet.Web.Modules.TransactionModule.Models;

namespace OnlineWallet.Web.TestHelpers
{
    static class CategoryStatExtensions
    {
        #region  Public Methods

        public static CategoryStatistics YearlyByName(this CategoryStatisticsSummary summ, string name)
        {
            return summ.Yearly.Find(e => e.Name == name);
        }

        #endregion
    }
}