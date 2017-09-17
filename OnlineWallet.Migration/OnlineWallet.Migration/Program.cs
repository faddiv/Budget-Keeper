using System;
using CommandLine;
using OnlineWallet.ExportImport;

namespace OnlineWallet.Migration
{
    public class Program
    {
        #region  Public Methods

        public static string AddExtension(string file)
        {
            if (file != null && !file.EndsWith(".csv"))
            {
                return file + ".csv";
            }
            return file;
        }

        public static void Execute(ProgramParameters programParameters)
        {
            try
            {
                var exporter = new CsvExportImport();
                var xlstLoader = new XlstLoader();
                exporter.ExportTransactions(programParameters.InputFiles
                        .CollectFileList()
                        .ReadIncomes(xlstLoader)
                        .FilterZeroEntries(),
                    AddExtension(programParameters.IncomeOutput));
                exporter.ExportTransactions(programParameters.InputFiles
                        .CollectFileList()
                        .ReadExpenses(xlstLoader),
                    AddExtension(programParameters.ExpenseOutput));
            }
            catch(Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
                Console.Error.WriteLine(ex.StackTrace);
            }
        }

        public static void Main(string[] args)
        {
            var programParameters = new ProgramParameters();
            if (Parser.Default.ParseArguments(args, programParameters) && programParameters.InputFiles?.Count > 0)
            {
                Execute(programParameters);
            }
            else
            {
                Console.Write(programParameters.GetUsage());
            }
        }

        #endregion
    }
}