using System;
using OnlineWallet.Web.Common;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    public class TransactionControllerTests : CrudControllerTests<Transaction>
    {
        protected TransactionController Controller { get; }
        protected Transaction TestTransaction { get; }

        public TransactionControllerTests(DatabaseFixture fixture) : base(fixture)
        {
            Controller = new TransactionController(Fixture.DbContext);
            TestTransaction = new Transaction
            {
                Category = "Test Category",
                Comment = "Test Comment",
                CreatedAt = DateTime.Parse("2017-10-15"),
                Direction = ExportImport.MoneyDirection.Expense,
                Name = "Test Name",
                Value = 123,
                Wallet = Fixture.WalletBankAccount
            };
            Fixture.DbContext.Add(TestTransaction);
        }
    }
}