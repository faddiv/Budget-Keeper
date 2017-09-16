using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.MoneyOperationModule
{
    [Trait("MoneyOperationController", null)]
    [Collection("Database collection")]
    public class MoneyOperationControllerTests : IDisposable
    {
        #region Fields

        private readonly DatabaseFixture _fixture;
        private readonly MoneyOperation _moneyOperation1;
        private readonly MoneyOperation _moneyOperation2;

        #endregion

        #region  Constructors

        public MoneyOperationControllerTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
            _moneyOperation1 = new MoneyOperation
            {
                Name = "first",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 101,
                WalletId = _fixture.Wallet1.MoneyWalletId
            };
            _moneyOperation2 = new MoneyOperation
            {
                Name = "second",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 102,
                WalletId = _fixture.Wallet2.MoneyWalletId
            };
            _fixture.DbContext.MoneyOperations.AddRange(_moneyOperation1, _moneyOperation2);
            _fixture.DbContext.SaveChanges();
        }

        #endregion

        #region  Public Methods

        [Fact(DisplayName = "BatchSave saves new MoneyOperations")]
        public async Task BatchSave_saves_new_MoneyOperations()
        {
            //precondition
            _fixture.DbContext.MoneyOperations.Count().Should().Be(2);
            //arrange
            var controller = new MoneyOperationController(_fixture.DbContext);
            var moneyOperations = new List<MoneyOperation>
            {
                new MoneyOperation
                {
                    Name = "third",
                    Category = "cat",
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 101,
                    WalletId = _fixture.Wallet1.MoneyWalletId
                },
                new MoneyOperation
                {
                    Name = "fourth",
                    Category = "cat",
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 102,
                    WalletId = _fixture.Wallet2.MoneyWalletId
                }
            };
            //act
            await controller.BatchSave(moneyOperations, CancellationToken.None);

            //assert
            _fixture.DbContext.MoneyOperations.Count().Should().Be(4);
            _fixture.DbContext.MoneyOperations.Should().Contain(e => e.Name == "third");
            _fixture.DbContext.MoneyOperations.Should().Contain(e => e.Name == "fourth");
        }


        [Fact(DisplayName = "BatchSave updates existing MoneyOperations")]
        public async Task BatchSave_updates_existing_MoneyOperations()
        {
            //precondition
            _fixture.DbContext.MoneyOperations.Count().Should().Be(2);
            //arrange
            var controller = new MoneyOperationController(_fixture.DbContext);
            var moneyOperations = new List<MoneyOperation>
            {
                new MoneyOperation
                {
                    MoneyOperationId = _moneyOperation1.MoneyOperationId,
                    Name = "third",
                    Category = "cat",
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 101,
                    WalletId = _fixture.Wallet1.MoneyWalletId
                },
                new MoneyOperation
                {
                    MoneyOperationId = _moneyOperation2.MoneyOperationId,
                    Name = "fourth",
                    Category = "cat",
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 102,
                    WalletId = _fixture.Wallet2.MoneyWalletId
                }
            };
            //act
            await controller.BatchSave(moneyOperations, CancellationToken.None);

            //assert
            _fixture.DbContext.MoneyOperations.Count().Should().Be(2);
            _fixture.DbContext.MoneyOperations.Should().Contain(e => e.Name == "third");
            _fixture.DbContext.MoneyOperations.Should().Contain(e => e.Name == "fourth");
        }

        public void Dispose()
        {
            _fixture.DbContext.RemoveRange(_fixture.DbContext.MoneyOperations);
            _fixture.DbContext.SaveChanges();
        }

        #endregion
    }
}