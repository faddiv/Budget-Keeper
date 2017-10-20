using System.Collections.Generic;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;

namespace OnlineWallet.ExportImport
{
    public class CsvExportImport : ICsvExportImport
    {
        private static readonly Configuration Configuration;
        #region  Constructors

        static CsvExportImport()
        {
            Configuration = new Configuration
            {
                HasHeaderRecord = true
            };
            Configuration.RegisterClassMap(new ExportImportRowCsvClassMap());
        }

        #endregion

        #region  Public Methods

        public void ExportTransactions(IEnumerable<ExportImportRow> imports, Stream stream)
        {
            using (var fileWriter = new StreamWriter(stream))
            {
                using (var csvWriter = new CsvWriter(fileWriter, Configuration))
                {
                    csvWriter.WriteRecords(imports);
                    fileWriter.Flush();
                }
            }
        }

        public IEnumerable<ExportImportRow> ImportTransactions(Stream stream)
        {
            using (var fileWriter = new StreamReader(stream))
            {
                using (var csvWriter = new CsvReader(fileWriter, Configuration))
                {
                    foreach (var exportImportRow in csvWriter.GetRecords<ExportImportRow>())
                    {
                        yield return exportImportRow;
                    }
                }
            }
        }

        #endregion
    }
}