using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using Xunit;
using MoneyDirection = OnlineWallet.ExportImport.MoneyDirection;

namespace OnlineWallet.Web.Modules.ImportExpensesModule
{
    [Trait("ImportController", null)]
    [Collection("Database collection")]
    public class ImportControllerTests : IDisposable
    {
        #region Fields

        private const string ImportCsvFilePath = "expectedExpenses.csv";

        private readonly DatabaseFixture _fixture;

        #endregion

        #region  Constructors

        public ImportControllerTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        #endregion

        #region  Public Methods

        public void Dispose()
        {
            _fixture.DbContext.RemoveRange(_fixture.DbContext.MoneyOperations);
            _fixture.DbContext.SaveChanges();
        }

        [Fact(DisplayName = "ProcessTransactions detects if amount changes while name and direction remain same")]
        public void ProcessTransactions_detects_if_amount_changes_while_name_and_direction_remain_same()
        {
            using (var stream = new FileStream(ImportCsvFilePath, FileMode.Open))
            {
                //Arrange
                var dbContext = _fixture.DbContext;
                var moneyOperation = new MoneyOperation
                {
                    Name = "expense 1",
                    Value = 111,
                    WalletId = 2,
                    Direction = DataLayer.MoneyDirection.Expense,
                    Category = "Category 1",
                    CreatedAt = DateTime.Parse("2017-08-26")
                };
                dbContext.MoneyOperations.Add(moneyOperation);
                dbContext.SaveChanges();
                var controller = new ImportController(new CsvExportImport(), dbContext);
                var formFile = new Mock<IFormFile>();
                formFile.SetupAllProperties();
                formFile.Setup(e => e.OpenReadStream()).Returns(stream);

                //Act
                var result = controller.ProcessTransactions(formFile.Object);

                //Assert
                var value = result.FirstOrDefault(e => e.Name == "expense 1");
                value.Should().NotBeNull();
                value.MatchingId.Should().Be(moneyOperation.MoneyOperationId);
            }
        }

        [Fact(DisplayName = "ProcessTransactions detects if name changes while wallet and Amount remain same")]
        public void ProcessTransactions_detects_if_name_changes_while_wallet_and_Amount_remain_same()
        {
            using (var stream = new FileStream(ImportCsvFilePath, FileMode.Open))
            {
                //Arrange
                var dbContext = _fixture.DbContext;
                var moneyOperation = new MoneyOperation
                {
                    Name = "Original Name",
                    Value = 123,
                    WalletId = 2,
                    Direction = DataLayer.MoneyDirection.Expense,
                    Category = "Category 1",
                    CreatedAt = DateTime.Parse("2017-08-26")
                };
                dbContext.MoneyOperations.Add(moneyOperation);
                dbContext.SaveChanges();
                var controller = new ImportController(new CsvExportImport(), dbContext);
                var formFile = new Mock<IFormFile>();
                formFile.SetupAllProperties();
                formFile.Setup(e => e.OpenReadStream()).Returns(stream);

                //Act
                var result = controller.ProcessTransactions(formFile.Object);

                //Assert
                var value = result.FirstOrDefault(e => e.Name == "expense 1");
                value.Should().NotBeNull();
                value.MatchingId.Should().Be(moneyOperation.MoneyOperationId);
            }
        }

        [Fact(DisplayName = "ProcessTransactions reads valid import file")]
        public void TransactionReadsValidImportFile()
        {
            using (var stream = new FileStream(ImportCsvFilePath, FileMode.Open))
            {
                //Arrange
                var dbContext = _fixture.DbContext;
                var controller = new ImportController(new CsvExportImport(), dbContext);
                var formFile = new Mock<IFormFile>();
                formFile.SetupAllProperties();
                formFile.Setup(e => e.OpenReadStream()).Returns(stream);

                //Act
                var result = controller.ProcessTransactions(formFile.Object);

                //Assert
                result.Should().NotBeNullOrEmpty("it reads the file");
                result.ShouldAllBeEquivalentTo(GetSampleData(), "It reads the exact data from file");
            }
        }

        #endregion

        #region  Nonpublic Methods

        private static WalletDbContext BuildDbContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<WalletDbContext>();
            optionsBuilder.UseInMemoryDatabase("Wallet");
            var dbContext = new WalletDbContext(optionsBuilder.Options);
            dbContext.Wallets.AddRange(
                new Wallet {MoneyWalletId = 1, Name = MoneySource.Cash.ToString()},
                new Wallet {MoneyWalletId = 2, Name = MoneySource.BankAccount.ToString()});
            dbContext.SaveChanges();
            return dbContext;
        }

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