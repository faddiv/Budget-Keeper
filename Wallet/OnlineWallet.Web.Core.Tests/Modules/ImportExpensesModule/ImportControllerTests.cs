using System;
using System.Collections.Generic;
using System.IO;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using OnlineWallet.ExportImport;
using Xunit;

namespace OnlineWallet.Web.Modules.ImportExpensesModule
{
    [Trait("ImportController", null)]
    public class ImportControllerTests
    {
        #region Fields

        private const string ImportCsvFilePath = "expectedExpenses.csv";

        #endregion

        #region  Public Methods

        [Fact(DisplayName = "Transaction reads valid import file")]
        public void TransactionReadsValidImportFile()
        {
            using (var stream = new FileStream(ImportCsvFilePath, FileMode.Open))
            {
                //Arrange
                var controller = new ImportController(new CsvExportImport());
                var formFile = new Mock<IFormFile>();
                formFile.SetupAllProperties();
                formFile.Setup(e => e.OpenReadStream()).Returns(stream);

                //Act
                var result = controller.Transactions(formFile.Object);

                //Assert
                result.Should().NotBeNullOrEmpty("it reads the file");
                result.ShouldAllBeEquivalentTo(GetSampleData(), "It reads the exact data from file");
            }
        }

        #endregion

        #region  Nonpublic Methods
        
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