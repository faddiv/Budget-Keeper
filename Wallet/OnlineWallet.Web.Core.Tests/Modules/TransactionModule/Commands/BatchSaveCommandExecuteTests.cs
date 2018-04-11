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

        [Fact(DisplayName = nameof(Should_invoke_events_on_update))]
        public async Task Should_invoke_events_on_update()
        {
            //Arrange
            var modifiedTransaction = AutoMapper.Mapper.Map<Transaction>(_transaction1);
            var batch = TransactionOperationBatch.SaveBatch(
                new List<Transaction>
                {
                    modifiedTransaction
                });

            //Act
            await _command.Execute(batch, CancellationToken.None);
            //Assert
            VerifyExecuteCalledWith(_transaction1, modifiedTransaction, BatchSaveOperationType.Update);
        }

        [Fact(DisplayName = nameof(Should_invoke_events_on_update))]
        public async Task Should_invoke_events_on_insert()
        {
            //Arrange
            var newTransaction = new TransactionBuilder().Build();
            var batch = TransactionOperationBatch.SaveBatch(new List<Transaction>
            {
                newTransaction
            });

            //Act
            await _command.Execute(batch, CancellationToken.None);
            //Assert
            VerifyExecuteCalledWith(null, newTransaction, BatchSaveOperationType.New);
        }

        [Fact(DisplayName = nameof(Should_invoke_events_on_update))]
        public async Task Should_invoke_events_on_delete()
        {
            //Arrange
            var batch = TransactionOperationBatch.DeleteBatch(
                new List<long> { _transaction1.TransactionId });

            //Act
            await _command.Execute(batch, CancellationToken.None);
            //Assert
            VerifyExecuteCalledWith(_transaction1, null, BatchSaveOperationType.Delete);
        }

        public void Dispose()
        {
            _services.Cleanup();
        }

        private void VerifyExecuteCalledWith(Transaction oldTransaction, Transaction newTransaction, BatchSaveOperationType operationType)
        {
            _mockEvent.Verify(e => e.BeforeSave(It.Is<TransactionEventArgs>(args =>
                args.Operations.Count == 1 &&
                ReferenceEquals(args.Operations[0].OldTransaction, oldTransaction) &&
                ReferenceEquals(args.Operations[0].NewTransaction, newTransaction) &&
                args.Operations[0].OperationType == operationType), CancellationToken.None));

            _mockEvent.Verify(e => e.AfterSave(It.Is<TransactionEventArgs>(args =>
                args.Operations.Count == 1 &&
                ReferenceEquals(args.Operations[0].OldTransaction, oldTransaction) &&
                ReferenceEquals(args.Operations[0].NewTransaction, newTransaction) &&
                args.Operations[0].OperationType == operationType), CancellationToken.None));
        }
    }
}
