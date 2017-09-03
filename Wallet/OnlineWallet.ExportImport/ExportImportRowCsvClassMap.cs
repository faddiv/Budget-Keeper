using CsvHelper.Configuration;

namespace OnlineWallet.ExportImport
{
    internal class ExportImportRowCsvClassMap : CsvClassMap<ExportImportRow>
    {
        public ExportImportRowCsvClassMap()
        {
            Map(e => e.Created).Index(0).TypeConverterOption("yyyy-MM-dd");
            Map(e => e.Name).Index(1);
            Map(e => e.Category).Index(2);
            Map(e => e.Amount).Index(3);
            Map(e => e.Source).Index(4);
            Map(e => e.Comment).Index(5);
            Map(e => e.Direction).Index(6);
        }
    }
}