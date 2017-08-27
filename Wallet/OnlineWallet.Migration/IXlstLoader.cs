using System.Collections.Generic;
using OnlineWallet.Migration.Schema;

namespace OnlineWallet.Migration
{
    public interface IXlstLoader
    {
        IEnumerable<Expense> LoadExpense(string fileName);
        IEnumerable<Income> LoadIncome(string fileName);
    }
}