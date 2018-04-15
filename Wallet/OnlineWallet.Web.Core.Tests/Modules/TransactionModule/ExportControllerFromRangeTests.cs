using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait(nameof(ExportController), nameof(ExportController.FromRange))]
    public class ExportControllerFromRangeTests : ServiceTestBase
    {
        private readonly ExportController _controller;

        public ExportControllerFromRangeTests()
        {
            _fixture.DbContext.Transactions.AddRange(
                new Transaction
                {
                    Name = "tr1",
                    CreatedAt = DateTime.Parse("2017-09-01"),
                    Wallet = _fixture.WalletBankAccount
                }, new Transaction
                {
                    Name = "tr2",
                    CreatedAt = DateTime.Parse("2017-09-30"),
                    Wallet = _fixture.WalletBankAccount
                }, new Transaction
                {
                    Name = "tr3",
                    CreatedAt = DateTime.Parse("2017-10-01"),
                    Wallet = _fixture.WalletBankAccount,
                    Category = "cat 1",
                    Direction = MoneyDirection.Expense,
                    Comment = "comm 1",
                    Value = 21
                }, new Transaction
                {
                    Name = "tr4",
                    CreatedAt = DateTime.Parse("2017-10-31"),
                    Wallet = _fixture.WalletCash,
                    Category = "cat 2",
                    Direction = MoneyDirection.Income,
                    Comment = "comm 2",
                    Value = 12
                }, new Transaction
                {
                    Name = "tr5",
                    CreatedAt = DateTime.Parse("2017-10-15"),
                    Wallet = _fixture.WalletBankAccount,
                    Category = "cat 1",
                    Direction = MoneyDirection.Expense,
                    Comment = "comm 1",
                    Value = 21
                }, new Transaction
                {
                    Name = "tr6",
                    CreatedAt = DateTime.Parse("2017-11-01"),
                    Wallet = _fixture.WalletBankAccount
                });
            _fixture.DbContext.SaveChanges();
            _controller = _fixture.GetService<ExportController>();
        }
        
        [Fact(DisplayName = nameof(Returns_with_FileContentResult))]
        public async Task Returns_with_FileContentResult()
        {
            var result = await _controller.FromRange(DateTime.Parse("2017-10-01"), DateTime.Parse("2017-10-31"), "file.csv") as FileContentResult;
            result.Should().NotBeNull();
        }

        [Fact(DisplayName = nameof(Returns_file_with_the_given_filename))]
        public async Task Returns_file_with_the_given_filename()
        {
            var result = (FileContentResult)await _controller.FromRange(DateTime.Parse("2017-10-01"), DateTime.Parse("2017-10-31"), "file.csv");
            result.FileDownloadName.Should().Be("file.csv");
        }

        [Fact(DisplayName = nameof(Adds_extension_to_the_filename))]
        public async Task Adds_extension_to_the_filename()
        {
            var result = (FileContentResult)await _controller.FromRange(DateTime.Parse("2017-10-01"), DateTime.Parse("2017-10-31"), "file");
            result.FileDownloadName.Should().Be("file.csv");
        }

        [Fact(DisplayName = nameof(Returns_the_exported_csv_from_range))]
        public async Task Returns_the_exported_csv_from_range()
        {
            var result = (FileContentResult)await _controller.FromRange(DateTime.Parse("2017-10-01"), DateTime.Parse("2017-10-31"), "file");
            var fileContent = Encoding.UTF8.GetString(result.FileContents);
            fileContent.Should().NotBeNullOrEmpty();
            var expected = File.ReadAllText("exportedExpenses.csv");
            fileContent.Should().Be(expected);
        }
    }
}
