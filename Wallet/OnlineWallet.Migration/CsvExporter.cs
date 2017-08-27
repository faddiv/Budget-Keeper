using System.Collections;
using System.Collections.Generic;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;
using OnlineWallet.Migration.Schema;

namespace OnlineWallet.Migration
{
    public class CsvExporter
    {
        #region  Constructors

        public CsvExporter()
        {
            
        }

        #endregion

        #region  Public Methods

        public void ExportExpenses(IEnumerable<Expense> imports, string path)
        {
            ExportAll(imports, path);
        }

        public void ExportIncomes(IEnumerable<Income> imports, string path)
        {
            ExportAll(imports, path);
        }

        #endregion

        #region  Nonpublic Methods

        private void ExportAll(IEnumerable imports, string path)
        {
            using (var fileStream = new FileStream(path, FileMode.Create))
            using (var fileWriter = new StreamWriter(fileStream))
            {
                CsvConfiguration configuration = new CsvConfiguration
                {
                    HasHeaderRecord = true
                };
                configuration.RegisterClassMap(new IncomeCsvClassMap());
                configuration.RegisterClassMap(new ExpenseCsvClassMap());
                using (var csvSerializer = new CsvSerializer(fileWriter, configuration))
                using (var csvWriter = new CsvWriter(csvSerializer))
                {
                    csvWriter.WriteRecords(imports);
                    fileWriter.Flush();
                }
            }
        }

        #endregion
    }
}