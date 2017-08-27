using System;
using System.Collections.Generic;
using System.IO;
using FluentAssertions;
using OnlineWallet.Migration.Schema;
using Xunit;

namespace OnlineWallet.Migration
{
    public class CsvExporterTests
    {
        private const string IncomesresultCsv = "incomeResult.csv";
        private const string ExportresultCsv = "expenseResult.csv";
        
        [Fact(DisplayName = "Exports expenses")]
        public void ExportsExpenses()
        {
            File.Delete(ExportresultCsv);
            var expenses = new List<Expense>
            {
                new Expense
                {
                    Name = "expense 1",
                    Amount = 123,
                    Category = "category 1",
                    Comment = "comment 1",
                    Created = DateTime.Parse("2017.08.26"),
                    Source = MoneySource.BankAccount
                }
            };
            var exporter = new CsvExporter();
            exporter.ExportExpenses(expenses, ExportresultCsv);
            File.ReadAllText(ExportresultCsv).Should().Be(
                File.ReadAllText("expectedExpenses.csv"));
        }

        [Fact(DisplayName = "Exports incomes")]
        public void ExportsIncomes()
        {
            File.Delete(IncomesresultCsv);
            var incomes = new List<Income>
            {
                new Income
                {
                    Amount = 123,
                    Month = 8,
                    Year = 2017,
                    Source = MoneySource.Cash
                }
            };
            var exporter = new CsvExporter();
            exporter.ExportIncomes(incomes, IncomesresultCsv);
            File.ReadAllText(IncomesresultCsv).Should().Be(
                File.ReadAllText("expectedIncomes.csv"));
        }
    }
}