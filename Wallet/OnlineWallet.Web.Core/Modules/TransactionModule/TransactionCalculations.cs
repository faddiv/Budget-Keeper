using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    public static class TransactionCalculations
    {
        public static int CalculateSavings(int income)
        {
            return (int)Math.Round(income * 0.25, MidpointRounding.AwayFromZero);
        }

        public static int CalculateUnused(int income, int expense, int planned)
        {
            return income - expense - planned - CalculateSavings(income);
        }
    }
}
