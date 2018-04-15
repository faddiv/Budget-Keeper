﻿using System;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait(nameof(TransactionController), nameof(TransactionController.FetchByDateRange))]
    [Collection("Provide Test Service")]
    public class TransactionControllerFetchByDateRangeTests : TransactionControllerTests
    {
        #region Fields

        private readonly Transaction _transaction1;
        private readonly Transaction _transaction2;
        private readonly Transaction _transaction3;

        #endregion

        #region  Constructors

        public TransactionControllerFetchByDateRangeTests(TestServiceProviderFixture fixture) : base(fixture)
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
                CreatedAt = DateTime.Parse("2017-10-16"),
                Direction = MoneyDirection.Expense,
                Value = 102,
                WalletId = Fixture.WalletBankAccount.MoneyWalletId
            };
            _transaction3 = new Transaction
            {
                Name = "second",
                Category = "cat",
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-11-16"),
                Direction = MoneyDirection.Expense,
                Value = 102,
                WalletId = Fixture.WalletBankAccount.MoneyWalletId
            };
            Fixture.DbContext.Transactions.AddRange(_transaction1, _transaction2, _transaction3);
            Fixture.DbContext.SaveChanges();
        }

        #endregion

        [Fact(DisplayName = nameof(Only_Fetches_in_date_range))]
        public async Task Only_Fetches_in_date_range()
        {
            var result = await Controller.FetchByDateRange(
                DateTime.Parse("2017-10-15"),
                DateTime.Parse("2017-10-17"));

            result.Should().NotBeNullOrEmpty();
            result.Should().NotContain(_transaction1);
            result.Should().Contain(_transaction2);
            result.Should().NotContain(_transaction3);
        }

        [Fact(DisplayName = nameof(Only_Fetches_in_date_range))]
        public async Task Fetches_date_range_inclusive()
        {
            var result = await Controller.FetchByDateRange(
                DateTime.Parse("2017-09-16"),
                DateTime.Parse("2017-10-16"));
            
            result.Should().Contain(_transaction1);
            result.Should().Contain(_transaction2);
        }

        [Fact(DisplayName = nameof(Fetches_latest_first))]
        public async Task Fetches_latest_first()
        {
            var result = await Controller.FetchByDateRange(
                DateTime.Parse("2017-09-15"),
                DateTime.Parse("2017-11-17"));

            result.Should().ContainInOrder(_transaction3, _transaction2, _transaction1);
        }
    }
}