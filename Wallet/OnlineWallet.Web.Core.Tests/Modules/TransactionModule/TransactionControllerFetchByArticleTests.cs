using System;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait(nameof(TransactionController), nameof(TransactionController.FetchByArticle))]
    [Collection("Provide Test Service")]
    public class TransactionControllerFetchByArticleTests : TransactionControllerTests
    {
        #region Fields

        private readonly Transaction _transaction1;
        private readonly Transaction _transaction2;
        private readonly Transaction _transaction3;
        private readonly Transaction _transaction4;

        #endregion

        #region  Constructors

        public TransactionControllerFetchByArticleTests(TestServiceProviderFixture fixture) : base(fixture)
        {
            _transaction1 = new Transaction
            {
                Name = "seconder",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 101,
                WalletId = Fixture.WalletCash.MoneyWalletId
            };
            _transaction2 = new Transaction
            {
                Name = "second",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 102,
                WalletId = Fixture.WalletBankAccount.MoneyWalletId
            };
            _transaction3 = new Transaction
            {
                Name = "second",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-17"),
                Direction = MoneyDirection.Expense,
                Value = 102,
                WalletId = Fixture.WalletBankAccount.MoneyWalletId
            };
            _transaction4 = new Transaction
            {
                Name = "Second",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-17"),
                Direction = MoneyDirection.Expense,
                Value = 102,
                WalletId = Fixture.WalletBankAccount.MoneyWalletId
            };
            Fixture.DbContext.Transactions.AddRange(_transaction1, _transaction2, _transaction3, _transaction4);
            Fixture.DbContext.SaveChanges();
        }

        #endregion

        [Fact(DisplayName = nameof(Fetch_is_case_insensitive))]
        public async Task Fetch_is_case_insensitive()
        {
            var result = await Controller.FetchByArticle("second");

            result.Should().NotBeNullOrEmpty();
            result.Should().NotContain(_transaction1);
            result.Should().Contain(_transaction2);
            result.Should().Contain(_transaction3);
            result.Should().Contain(_transaction4);
        }

        [Fact(DisplayName =nameof(Fetches_latest_first))]
        public async Task Fetches_latest_first()
        {
            var result = await Controller.FetchByArticle("second");
            
            result.Should().ContainInOrder(_transaction3, _transaction2);
        }
    }
}