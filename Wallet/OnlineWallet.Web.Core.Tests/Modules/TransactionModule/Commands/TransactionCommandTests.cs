using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Castle.Components.DictionaryAdapter;
using FluentAssertions;
using Moq;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    [Trait(nameof(TransactionCommand), nameof(TransactionCommand.Execute))]
    [Collection("Database collection")]
    public class TransactionCommandTests
    {
        private readonly DatabaseFixture _fixture;
        private Transaction _transaction1;
        private Transaction _transaction2;
        private const string firstArticle = "first";
        private const string secondArticle = "second";
        private const string exampleCategory = "cat";

        public TransactionCommandTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
            _transaction1 = new Transaction
            {
                Name = firstArticle,
                Category = exampleCategory,
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 101,
                WalletId = _fixture.WalletCash.MoneyWalletId
            };
            _transaction2 = new Transaction
            {
                Name = secondArticle,
                Category = exampleCategory,
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 102,
                WalletId = _fixture.WalletBankAccount.MoneyWalletId
            };
            _fixture.DbContext.Transactions.AddRange(_transaction1, _transaction2);
            _fixture.DbContext.SaveChanges();
        }

        [Fact(DisplayName = nameof(ShouldInvokeEventsOnUpdate))]
        public async Task ShouldInvokeEventsOnUpdate()
        {
            //Arrange
            var mockEvent = new Moq.Mock<ITransactionEvent>();
            var events = new List<ITransactionEvent> {mockEvent.Object};
            var command = new TransactionCommand(_fixture.DbContext, events);
            //Act
            var modifiedTransaction = AutoMapper.Mapper.Map<Transaction>(_transaction1);
            var batch = new TransactionOperationBatch
            {
                Save = new List<Transaction>
                {
                    modifiedTransaction
                },
                Delete = new List<long>()
            };
            await command.Execute(batch, CancellationToken.None);
            //Assert
            mockEvent.Verify(e => e.Execute(It.Is<TransactionEventArgs>(args => 
                object.ReferenceEquals(args.OldTransaction, _transaction1) &&
                object.ReferenceEquals(args.NewTransaction, modifiedTransaction) &&
                args.OperationType ==BatchSaveOperationType.Update)));
        }
    }
}
