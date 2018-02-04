using System;

namespace OnlineWallet.Web.Modules.TransactionModule.Services
{
    public static class TransactionCalculations
    {
        #region  Public Methods

        public static int CalculateSavings(int income)
        {
            return (int) Math.Round(income * 0.25, MidpointRounding.AwayFromZero);
        }

        public static int CalculateUnused(int income, int expense, int planned)
        {
            return income - expense - planned - CalculateSavings(income);
        }

        #endregion
    }
}