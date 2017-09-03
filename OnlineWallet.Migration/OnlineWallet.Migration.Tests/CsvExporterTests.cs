using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using FluentAssertions;
using OnlineWallet.ExportImport;
using Xunit;

namespace OnlineWallet.Migration
{
    [Trait("CsvExporter", null)]
    public class CsvExporterTests
    {
        private const string ExportresultCsv = "expenseResult.csv";
        private const string ExpectedExpensesPath = "expectedExpenses.csv";

        [Fact(DisplayName = "Exports incomes and expenses")]
        public void ExportsIncomesAnyExpenses()
        {
            //Arrange
            File.Delete(ExportresultCsv);
            var expenses = GetSampleData();
            var exporter = new CsvExportImport();

            //Act
            exporter.ExportMoneyOperations(expenses, ExportresultCsv);

            //Assert
            File.ReadAllText(ExportresultCsv).Should().Be(
                File.ReadAllText(ExpectedExpensesPath));
        }

        [Fact(DisplayName = "Imports MoneyOperations")]
        public void ImportsMoneyOperations()
        {
            //Arrange
            var expectation = GetSampleData();
            var exporter = new CsvExportImport();

            //Act
            List<ExportImportRow> result;
            using (var fileStream = new FileStream(ExpectedExpensesPath, FileMode.Open))
                result = exporter.ImportMoneyOperations(fileStream).ToList();

            //Assert
            result.Should().NotBeNullOrEmpty();
            result.ShouldAllBeEquivalentTo(expectation);
        }

        #region SampleData
        
        private static List<ExportImportRow> GetSampleData()
        {
            return new List<ExportImportRow>
            {
                new ExportImportRow
                {
                    Name = "expense 1",
                    Amount = 123,
                    Category = "category 1",
                    Comment = "comment 1",
                    Created = DateTime.Parse("2017.08.26"),
                    Source = MoneySource.BankAccount,
                    Direction = MoneyDirection.Expense
                },
                new ExportImportRow
                {
                    Name = "Salary by Cash",
                    Amount = 123,
                    Created = DateTime.Parse("2017.08.01"),
                    Source = MoneySource.Cash,
                    Category = "xxx",
                    Comment = "comment 1",
                    Direction = MoneyDirection.Income
                }
            };
        }

        #endregion
    }
}