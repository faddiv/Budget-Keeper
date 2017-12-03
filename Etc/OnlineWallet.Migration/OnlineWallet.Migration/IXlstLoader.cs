using System.Collections.Generic;
using OnlineWallet.ExportImport;

namespace OnlineWallet.Migration
{
    public interface IXlstLoader
    {
        IEnumerable<ExportImportRow> LoadExpense(string fileName);
        IEnumerable<ExportImportRow> LoadIncome(string fileName);
    }
}