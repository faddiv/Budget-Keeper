using System.Collections.Generic;

namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public class CategoryStatisticsSummary
    {
        #region Properties

        public List<List<CategoryStatistics>> Monthly { get; set; }
        public List<CategoryStatistics> Yearly { get; set; }

        #endregion
    }
}