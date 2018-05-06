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
    public class BatchSaveCommandExecuteTests : IDisposable
    {
        private readonly Transaction _transaction1;
        private Mock<IBatchSaveEvent> _mockEvent;
        private readonly IBatchSaveCommand _command;

        public BatchSaveCommandExecuteTests()
        {
            _mockEvent = new Mock<IBatchSaveEvent>();
            Fixture = TestServicesFactory.CreateServiceFixture(_mockEvent);
            _command = Fixture.GetService<IBatchSaveCommand>();
            _transaction1 = new TransactionBuilder().Build();
            Fixture.DbContext.Transactions.AddRange(_transaction1);
            Fixture.DbContext.SaveChanges();
        }

        public TestServices Fixture { get; }

        public void Dispose()
        {
            Fixture?.Dispose();
        }

        [Fact(DisplayName = nameof(Should_invoke_events_on_update))]
        public async Task Should_invoke_events_on_update()
        {
            //Arrange
            var modifiedTransaction = Fixture.Clone(_transaction1);
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

        [Fact(DisplayName = nameof(Should_invoke_events_on_insert))]
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

        [Fact(DisplayName = nameof(Should_invoke_events_on_delete))]
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
