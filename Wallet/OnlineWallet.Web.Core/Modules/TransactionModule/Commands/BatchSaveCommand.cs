using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule.Models;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    public class BatchSaveCommand : IBatchSaveCommand
    {
        #region Fields

        private readonly IWalletDbContext _db;

        #endregion

        #region  Constructors

        public BatchSaveCommand(IWalletDbContext db, IReadOnlyCollection<IBatchSaveEvent> events)
        {
            _db = db;
            Events = events;
        }

        #endregion

        #region Properties

        public IReadOnlyCollection<IBatchSaveEvent> Events { get; }

        #endregion

        #region  Public Methods

        public async Task Execute(TransactionOperationBatch model, CancellationToken token)
        {
            var existingIds = model.Save.Where(e => e.TransactionId > 0).Select(e => e.TransactionId).ToList();
            existingIds.AddRange(model.Delete);
            var existingEntities = _db.Transactions.Where(e => existingIds.Contains(e.TransactionId)).ToList();
            var operations = new List<TransactionOperation>();
            foreach (var operation in model.Save)
            {
                token.ThrowIfCancellationRequested();
                operation.CreatedAt = operation.CreatedAt.Date;
                if (operation.TransactionId != 0)
                {
                    var existingEntity = existingEntities.Find(e => e.TransactionId == operation.TransactionId);

                    operations.Add(new TransactionOperation(existingEntity, operation, BatchSaveOperationType.Update));
                }
                else
                {
                    operations.Add(new TransactionOperation(null, operation, BatchSaveOperationType.New));
                }
            }

            foreach (var id in model.Delete)
            {
                token.ThrowIfCancellationRequested();
                var existingEntity = existingEntities.Find(e => e.TransactionId == id);
                if (existingEntity != null)
                {
                    operations.Add(new TransactionOperation(existingEntity, null, BatchSaveOperationType.Delete));
                }
            }

            var args = new TransactionEventArgs(operations);
            foreach (var transactionEvent in Events)
            {
                token.ThrowIfCancellationRequested();
                transactionEvent.BeforeSave(args, token);
            }

            foreach (var operation in operations)
            {
                token.ThrowIfCancellationRequested();
                switch (operation.OperationType)
                {
                    case BatchSaveOperationType.Update:
                        //Too slow. Need to be replaced with a custom solution. (And should make multi threaded)
                        _db.UpdateEntityValues(operation.OldTransaction, operation.NewTransaction);
                        break;
                    case BatchSaveOperationType.New:
                        await _db.Transactions.AddAsync(operation.NewTransaction, token);
                        break;
                    case BatchSaveOperationType.Delete:
                        _db.Transactions.Remove(operation.OldTransaction);
                        break;
                }
            }

            await _db.SaveChangesAsync(token);

            foreach (var transactionEvent in Events)
            {
                token.ThrowIfCancellationRequested();
                transactionEvent.AfterSave(args, token);
            }
        }

        #endregion
    }


    public interface IBatchSaveCommand
    {
        #region  Public Methods

        Task Execute(TransactionOperationBatch model, CancellationToken token);

        #endregion
    }
}