using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.Common.Queries;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait("TransactionController", "GetAll")]
    [Collection("Database collection")]
    public class TransactionControllerGetAllTests : IDisposable
    {
        #region Fields

        private readonly DatabaseFixture _fixture;

        #endregion

        #region  Constructors

        public TransactionControllerGetAllTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
            _fixture.DbContext.Transactions.AddRange(new Transaction
            {
                Name = "first",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 101,
                WalletId = _fixture.WalletCash.MoneyWalletId
            },
            new Transaction
            {
                Name = "second",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 102,
                WalletId = _fixture.WalletBankAccount.MoneyWalletId
            },

                new Transaction
                {
                    Name = "third",
                    Category = "cat",
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 101,
                    WalletId = _fixture.WalletCash.MoneyWalletId
                },
                new Transaction
                {
                    Name = "fourth",
                    Category = "cat",
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 102,
                    WalletId = _fixture.WalletBankAccount.MoneyWalletId
                });
            _fixture.DbContext.SaveChanges();
        }

        #endregion

        #region  Public Methods

        [Fact(DisplayName = "on given sorting parameter sorts the output")]
        public async Task CanSort_GetAll_Operation()
        {

            var controller = new TransactionController(_fixture.DbContext);

            var result = await controller.GetAll(new QueryRequest
            {
                Sorting = "Value, Name"
            }, CancellationToken.None);
            result.Should().NotBeNull();
            result.Should().BeInAscendingOrder(e => e.Value);
        }

        public void Dispose()
        {
            _fixture.DbContext.RemoveRange(_fixture.DbContext.Transactions);
            _fixture.DbContext.SaveChanges();
        }

        #endregion
    }
}