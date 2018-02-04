using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait(nameof(TransactionController), nameof(TransactionController.BatchSave))]
    [Collection("Database collection")]
    public class TransactionControllerBatchSaveTests : TransactionControllerTests
    {
        #region Fields

        private readonly Transaction _transaction1;
        private readonly Transaction _transaction2;

        #endregion

        #region  Constructors

        public TransactionControllerBatchSaveTests(DatabaseFixture fixture) : base(fixture)
        {
            _transaction1 = new Transaction
            {
                Name = "first",
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
            DbSet.AddRange(_transaction1, _transaction2);
            Fixture.DbContext.SaveChanges();
        }

        #endregion

        #region  Public Methods

        [Fact(DisplayName = "BatchSave saves new Transactions")]
        public async Task BatchSave_saves_new_Transactions()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
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
                    WalletId = Fixture.WalletCash.MoneyWalletId
                },
                new Transaction
                {
                    Name = "fourth",
                    Category = "cat",
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 102,
                    WalletId = Fixture.WalletBankAccount.MoneyWalletId
                }
            }
            };
            //act
            var actionResult = await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            DbSet.Count().Should().Be(4);
            DbSet.Should().Contain(e => e.Name == "third");
            DbSet.Should().Contain(e => e.Name == "fourth");

            var result = ControllerTestHelpers.ValidateJsonResult<List<Transaction>>(actionResult);
            result.Should().NotBeNullOrEmpty();
            result.Should().OnlyContain(e => e.TransactionId > 0, "all element got an id");
        }



        [Fact(DisplayName = "BatchSave updates existing Transactions")]
        public async Task BatchSave_updates_existing_Transactions()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
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
                    WalletId = Fixture.WalletCash.MoneyWalletId
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
                    WalletId = Fixture.WalletBankAccount.MoneyWalletId
                }
            }
            };
            //act
            await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            DbSet.Count().Should().Be(2);
            DbSet.Should().Contain(e => e.Name == "third");
            DbSet.Should().Contain(e => e.Name == "fourth");
        }

        [Fact(DisplayName = "BatchSave only saves date not time")]
        public async Task BatchSave_only_saves_date_not_time()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
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
                    WalletId = Fixture.WalletCash.MoneyWalletId
                }
            }
            };
            //act
            var actionResult = await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            var result = ControllerTestHelpers.ValidateJsonResult<List<Transaction>>(actionResult);
            var dateTime = DateTime.Parse("2017-09-16 00:00");
            result[0].CreatedAt.Should().Be(dateTime, "it removes time part in the result");
            var entity = Fixture.DbContext.Transactions.Find(result[0].TransactionId);
            entity.CreatedAt.Should().Be(dateTime, "it removes time part in the database");
        }

        [Fact(DisplayName = "BatchSave can delete transactions by id")]
        public async Task BatchSave_can_delete_transactions_by_id()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
            var transactions = new TransactionOperationBatch
            {
                Delete = new List<long> { _transaction1.TransactionId }
            };
            //act
            var actionResult = await controller.BatchSave(transactions, CancellationToken.None);

            //assert

            var result = ControllerTestHelpers.ValidateJsonResult<List<Transaction>>(actionResult);
            DbSet.Should().NotContain(e => e.TransactionId == _transaction1.TransactionId, "it is deleted");
        }

        [Fact(DisplayName = "BatchSave_returns_BadRequest_if_input_invalid")]
        public async Task BatchSave_returns_BadRequest_if_input_invalid()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
            var transactions = new TransactionOperationBatch
            {
                Save = TransactionBuilder.CreateListOfSize(1).BuildList().ToList()
            };
            controller.ModelState.AddModelError("Name", "Invalid");
            //act
            var actionResult = await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            ControllerTestHelpers.ResultShouldBeBadRequest(actionResult);

        }

        #endregion
    }
}