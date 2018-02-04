using System;
using System.IO;
using System.Text;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.ExportExpensesModule
{
    [Trait("ExportController.FromRange", null)]
    [Collection("Database collection")]
    public class ExportControllerTests : IDisposable
    {
        private readonly DatabaseFixture _fixture;
        private readonly ExportController _controller;

        public ExportControllerTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
            var dbContext = fixture.DbContext;

            #region Test data

            dbContext.Transactions.AddRange(
                new Transaction
                {
                    Name = "tr1",
                    CreatedAt = DateTime.Parse("2017-09-01"),
                    Wallet = fixture.WalletBankAccount
                }, new Transaction
                {
                    Name = "tr2",
                    CreatedAt = DateTime.Parse("2017-09-30"),
                    Wallet = fixture.WalletBankAccount
                }, new Transaction
                {
                    Name = "tr3",
                    CreatedAt = DateTime.Parse("2017-10-01"),
                    Wallet = fixture.WalletBankAccount,
                    Category = "cat 1",
                    Direction = MoneyDirection.Expense,
                    Comment = "comm 1",
                    Value = 21
                }, new Transaction
                {
                    Name = "tr4",
                    CreatedAt = DateTime.Parse("2017-10-31"),
                    Wallet = fixture.WalletCash,
                    Category = "cat 2",
                    Direction = MoneyDirection.Income,
                    Comment = "comm 2",
                    Value = 12
                }, new Transaction
                {
                    Name = "tr5",
                    CreatedAt = DateTime.Parse("2017-10-15"),
                    Wallet = fixture.WalletBankAccount,
                    Category = "cat 1",
                    Direction = MoneyDirection.Expense,
                    Comment = "comm 1",
                    Value = 21
                }, new Transaction
                {
                    Name = "tr6",
                    CreatedAt = DateTime.Parse("2017-11-01"),
                    Wallet = fixture.WalletBankAccount
                });

            #endregion
            dbContext.SaveChanges();
            _controller = _fixture.GetService<ExportController>();
        }
        
        public void Dispose()
        {
            _fixture.DbContext.Transactions.RemoveRange(_fixture.DbContext.Transactions);
            _controller?.Dispose();
        }

        [Fact(DisplayName = "returns with FileContentResult")]
        public void Returns_with_FileContentResult()
        {
            var result = _controller.FromRange(DateTime.Parse("2017-10-01"), DateTime.Parse("2017-10-31"), "file.csv") as FileContentResult;
            result.Should().NotBeNull();
        }

        [Fact(DisplayName = "returns file with the given filename")]
        public void Returns_file_with_the_given_filename()
        {
            var result = (FileContentResult)_controller.FromRange(DateTime.Parse("2017-10-01"), DateTime.Parse("2017-10-31"), "file.csv");
            result.FileDownloadName.Should().Be("file.csv");
        }

        [Fact(DisplayName = "adds extension to the filename")]
        public void Adds_extension_to_the_filename()
        {
            var result = (FileContentResult)_controller.FromRange(DateTime.Parse("2017-10-01"), DateTime.Parse("2017-10-31"), "file");
            result.FileDownloadName.Should().Be("file.csv");
        }

        [Fact(DisplayName = "Returns the exported csv from range")]
        public void Returns_the_exported_csv_from_range()
        {
            var result = (FileContentResult)_controller.FromRange(DateTime.Parse("2017-10-01"), DateTime.Parse("2017-10-31"), "file");
            var fileContent = Encoding.UTF8.GetString(result.FileContents);
            fileContent.Should().NotBeNullOrEmpty();
            var expected = File.ReadAllText("exportedExpenses.csv");
            fileContent.Should().Be(expected);
        }
    }
}
