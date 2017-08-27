using CsvHelper.Configuration;
using OnlineWallet.Migration.Schema;

namespace OnlineWallet.Migration
{
    internal class ExpenseCsvClassMap : CsvClassMap<Expense>
    {
        public ExpenseCsvClassMap()
        {
            Map(e => e.Created).Index(0).TypeConverterOption("yyyy-MM-dd");
            Map(e => e.Name).Index(1);
            Map(e => e.Category).Index(2);
            Map(e => e.Amount).Index(3);
            Map(e => e.Source).Index(4);
            Map(e => e.Comment).Index(5);
        }
    }
}