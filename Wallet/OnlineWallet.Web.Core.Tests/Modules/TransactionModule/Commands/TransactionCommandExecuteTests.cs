using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Castle.Components.DictionaryAdapter;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
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
    public class TransactionCommandExecuteTests : IDisposable
    {
        private readonly DatabaseFixture _fixture;
        private Transaction _transaction1;
        private Transaction _transaction2;
        private const string firstArticle = "first";
        private const string secondArticle = "second";
        private const string exampleCategory = "cat";
        private readonly Mock<ITransactionEvent> _mockEvent;
        private readonly ServicesFixture _services;
        private readonly ITransactionCommand _command;

        public TransactionCommandExecuteTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
            _mockEvent = new Mock<ITransactionEvent>();
            _services = _fixture.CreateServiceFixture(_mockEvent);
            _command = _services.GetService<ITransactionCommand>();
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
            

            var modifiedTransaction = AutoMapper.Mapper.Map<Transaction>(_transaction1);
            var batch = new TransactionOperationBatch
            {
                Save = new List<Transaction>
                {
                    modifiedTransaction
                },
                Delete = new List<long>()
            };

            //Act
            await _command.Execute(batch, CancellationToken.None);
            //Assert
            _mockEvent.Verify(e => e.Execute(It.Is<TransactionEventArgs>(args => 
                ReferenceEquals(args.OldTransaction, _transaction1) &&
                ReferenceEquals(args.NewTransaction, modifiedTransaction) &&
                args.OperationType ==BatchSaveOperationType.Update)));
        }

        public void Dispose()
        {
            _services.Cleanup();
        }
    }
}
