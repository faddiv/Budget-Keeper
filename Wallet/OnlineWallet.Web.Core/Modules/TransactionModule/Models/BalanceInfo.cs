using OnlineWallet.Web.Modules.TransactionModule.Services;

namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public class BalanceInfo
    {
        #region Properties

        public int ToSaving => TransactionCalculations.CalculateSavings(Income);
        public int Unused => TransactionCalculations.CalculateUnused(Income, Spent, Planned);
        public int Income { get; set; }
        public int Planned { get; set; }
        public int Spent { get; set; }

        #endregion
    }
}