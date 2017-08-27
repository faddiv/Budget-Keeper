using System;
using System.Collections.Generic;
using System.IO;
using OnlineWallet.Migration.Schema;

namespace OnlineWallet.Migration
{
    public static class MigrationStreams
    {
        #region  Public Methods

        public static IEnumerable<string> CollectFileList(this IList<string> inputFileParameters)
        {
            foreach (var inputFileParameter in inputFileParameters)
            {
                foreach (var file in Directory.EnumerateFiles(Environment.CurrentDirectory, inputFileParameter))
                {
                    yield return file;
                }
            }
        }

        public static IEnumerable<Expense> ReadExpenses(this IEnumerable<string> files, IXlstLoader loader)
        {
            foreach (var file in files)
            {
                foreach (var income in loader.LoadExpense(file))
                {
                    yield return income;
                }
            }
        }

        public static IEnumerable<Income> ReadIncomes(this IEnumerable<string> files, IXlstLoader loader)
        {
            foreach (var file in files)
            {
                foreach (var income in loader.LoadIncome(file))
                {
                    yield return income;
                }
            }
        }

        #endregion

        public static IEnumerable<Income> FilterZeroEntries(this IEnumerable<Income> incomes)
        {
            foreach (var income in incomes)
            {
                if (income.Amount > 0)
                {
                    yield return income;
                }
            }
        }
    }
}