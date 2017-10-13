using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait("TransactionController", "BatchSave")]
    [Collection("Database collection")]
    public class TransactionControllerBatchSaveTests : IDisposable
    {
        #region Fields

        private readonly DatabaseFixture _fixture;
        private readonly Transaction _transaction1;
        private readonly Transaction _transaction2;

        #endregion

        #region  Constructors

        public TransactionControllerBatchSaveTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
            _transaction1 = new Transaction
            {
                Name = "first",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 101,
                WalletId = _fixture.WalletCash.MoneyWalletId
            };
            _transaction2 = new Transaction
            {
                Name = "second",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 102,
                WalletId = _fixture.WalletBankAccount.MoneyWalletId
            };
            _fixture.DbContext.Transactions.AddRange(_transaction1, _transaction2);
            _fixture.DbContext.SaveChanges();
        }

        #endregion

        #region  Public Methods

        [Fact(DisplayName = "BatchSave saves new Transactions")]
        public async Task BatchSave_saves_new_Transactions()
        {
            //precondition
            _fixture.DbContext.Transactions.Count().Should().Be(2);
            //arrange
            var controller = new TransactionController(_fixture.DbContext);
            var transactions = new TransactionOperationBatch
            {
                Save = new List<Transaction>
                {
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
                }
            }
            };
            //act
            var result = await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            _fixture.DbContext.Transactions.Count().Should().Be(4);
            _fixture.DbContext.Transactions.Should().Contain(e => e.Name == "third");
            _fixture.DbContext.Transactions.Should().Contain(e => e.Name == "fourth");

            result.Should().NotBeNullOrEmpty();
            result.Should().OnlyContain(e => e.TransactionId > 0, "all element got an id");
        }


        [Fact(DisplayName = "BatchSave updates existing Transactions")]
        public async Task BatchSave_updates_existing_Transactions()
        {
            //precondition
            _fixture.DbContext.Transactions.Count().Should().Be(2);
            //arrange
            var controller = new TransactionController(_fixture.DbContext);
            var transactions = new TransactionOperationBatch
            {
                Save = new List<Transaction>
            {
                new Transaction
                {
                    TransactionId = _transaction1.TransactionId,
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
                    TransactionId = _transaction2.TransactionId,
                    Name = "fourth",
                    Category = "cat",
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 102,
                    WalletId = _fixture.WalletBankAccount.MoneyWalletId
                }
            }
            };
            //act
            await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            _fixture.DbContext.Transactions.Count().Should().Be(2);
            _fixture.DbContext.Transactions.Should().Contain(e => e.Name == "third");
            _fixture.DbContext.Transactions.Should().Contain(e => e.Name == "fourth");
        }

        [Fact(DisplayName = "BatchSave only saves date not time")]
        public async Task BatchSave_only_saves_date_not_time()
        {
            //precondition
            _fixture.DbContext.Transactions.Count().Should().Be(2);
            //arrange
            var controller = new TransactionController(_fixture.DbContext);
            var transactions = new TransactionOperationBatch
            {
                Save = new List<Transaction>
            {
                new Transaction
                {
                    Name = "third",
                    Category = "cat",
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16 13:12"),
                    Direction = MoneyDirection.Expense,
                    Value = 101,
                    WalletId = _fixture.WalletCash.MoneyWalletId
                }
            }
            };
            //act
            var result = await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            var dateTime = DateTime.Parse("2017-09-16 00:00");
            result[0].CreatedAt.Should().Be(dateTime, "it removes time part in the result");
            var entity = _fixture.DbContext.Transactions.Find(result[0].TransactionId);
            entity.CreatedAt.Should().Be(dateTime, "it removes time part in the database");
        }

        [Fact(DisplayName = "BatchSave can delete transactions by id")]
        public async Task BatchSave_can_delete_transactions_by_id()
        {
            //precondition
            _fixture.DbContext.Transactions.Count().Should().Be(2);
            //arrange
            var controller = new TransactionController(_fixture.DbContext);
            var transactions = new TransactionOperationBatch
            {
                Delete = new List<long> { _transaction1.TransactionId }
            };
            //act
            var result = await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            _fixture.DbContext.Transactions.Should().NotContain(e => e.TransactionId == _transaction1.TransactionId, "it is deleted");
        }

        public void Dispose()
        {
            _fixture.DbContext.RemoveRange(_fixture.DbContext.Transactions);
            _fixture.DbContext.SaveChanges();
        }

        #endregion
    }
}