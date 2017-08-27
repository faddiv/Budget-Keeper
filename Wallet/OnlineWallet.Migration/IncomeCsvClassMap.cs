using CsvHelper.Configuration;
using OnlineWallet.Migration.Schema;

namespace OnlineWallet.Migration
{
    internal class IncomeCsvClassMap : CsvClassMap<Income>
    {
        public IncomeCsvClassMap()
        {
            Map(e => e.Year).Index(0);
            Map(e => e.Month).Index(1);
            Map(e => e.Amount).Index(2);
            Map(e => e.Source).Index(3);
        }
    }
}