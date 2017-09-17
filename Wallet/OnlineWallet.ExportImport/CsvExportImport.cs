using System.Collections.Generic;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;

namespace OnlineWallet.ExportImport
{
    public class CsvExportImport : ICsvExportImport
    {
        private readonly CsvConfiguration _configuration;
        #region  Constructors

        public CsvExportImport()
        {
            _configuration = new CsvConfiguration
            {
                HasHeaderRecord = true
            };
            _configuration.RegisterClassMap(new ExportImportRowCsvClassMap());
        }

        #endregion

        #region  Public Methods

        public void ExportTransactions(IEnumerable<ExportImportRow> imports, string path)
        {
            using (var fileStream = new FileStream(path, FileMode.Create))
            using (var fileWriter = new StreamWriter(fileStream))
            {
                using (var csvWriter = new CsvWriter(fileWriter, _configuration))
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
                using (var csvWriter = new CsvReader(fileWriter, _configuration))
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