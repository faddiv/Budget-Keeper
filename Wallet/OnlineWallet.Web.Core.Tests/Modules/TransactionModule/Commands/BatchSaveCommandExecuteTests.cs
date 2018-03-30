using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    [Trait(nameof(BatchSaveCommand), nameof(BatchSaveCommand.Execute))]
    [Collection("Database collection")]
    public class BatchSaveCommandExecuteTests : IDisposable
    {
        private readonly Transaction _transaction1;
        private readonly Mock<IBatchSaveEvent> _mockEvent;
        private readonly ServicesFixture _services;
        private readonly IBatchSaveCommand _command;

        public BatchSaveCommandExecuteTests(DatabaseFixture fixture)
        {
            _mockEvent = new Mock<IBatchSaveEvent>();
            _services = fixture.CreateServiceFixture(_mockEvent);
            _command = _services.GetService<IBatchSaveCommand>();
            _transaction1 = new TransactionBuilder().Build();
            fixture.DbContext.Transactions.AddRange(_transaction1);
            fixture.DbContext.SaveChanges();
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

        [Fact(DisplayName = nameof(ShouldInvokeEventsOnUpdate))]
        public async Task ShouldInvokeEventsOnInsert()
        {
            //Arrange
            var newTransaction = new TransactionBuilder().Build();
            var batch = new TransactionOperationBatch
            {
                Save = new List<Transaction>
                {
                    newTransaction
                },
                Delete = new List<long>()
            };

            //Act
            await _command.Execute(batch, CancellationToken.None);
            //Assert
            _mockEvent.Verify(e => e.Execute(It.Is<TransactionEventArgs>(args =>
                ReferenceEquals(args.OldTransaction, null) &&
                ReferenceEquals(args.NewTransaction, newTransaction) &&
                args.OperationType == BatchSaveOperationType.New)));
        }

        [Fact(DisplayName = nameof(ShouldInvokeEventsOnUpdate))]
        public async Task ShouldInvokeEventsOnDelete()
        {
            //Arrange
            var batch = new TransactionOperationBatch
            {
                Save = new List<Transaction>(),
                Delete = new List<long> { _transaction1.TransactionId }
            };

            //Act
            await _command.Execute(batch, CancellationToken.None);
            //Assert
            _mockEvent.Verify(e => e.Execute(It.Is<TransactionEventArgs>(args =>
                ReferenceEquals(args.OldTransaction, _transaction1) &&
                ReferenceEquals(args.NewTransaction, null) &&
                args.OperationType == BatchSaveOperationType.Delete)));
        }

        public void Dispose()
        {
            _services.Cleanup();
        }
    }
}
