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

        public IReadOnlyCollection<IBatchSaveEvent> Events { get; }

        #region  Public Methods

        public async Task Execute(TransactionOperationBatch model, CancellationToken token)
        {
            var existingIds = model.Save.Where(e => e.TransactionId > 0).Select(e => e.TransactionId).ToList();
            existingIds.AddRange(model.Delete);
            var existingEntities = _db.Transactions.Where(e => existingIds.Contains(e.TransactionId)).ToList();
            foreach (var operation in model.Save)
            {
                operation.CreatedAt = operation.CreatedAt.Date;
                if (operation.TransactionId != 0)
                {
                    var existingEntity = existingEntities.Find(e => e.TransactionId == operation.TransactionId);

                    await FireEvents(BatchSaveOperationType.Update, existingEntity, operation);
                    //Too slow. Need to be replaced with a custom solution. (And should make multi threaded)
                    _db.UpdateEntityValues(existingEntity, operation);

                }
                else
                {
                    await FireEvents(BatchSaveOperationType.New, null, operation);
                    await _db.Transactions.AddAsync(operation, token);
                    token.ThrowIfCancellationRequested();
                }
            }

            foreach (var id in model.Delete)
            {
                var existingEntity = existingEntities.Find(e => e.TransactionId == id);
                if (existingEntity != null)
                {
                    await FireEvents(BatchSaveOperationType.Delete, existingEntity, null);
                    _db.Transactions.Remove(existingEntity);
                }
            }

            await _db.SaveChangesAsync(token);
        }

        private async Task FireEvents(BatchSaveOperationType type, Transaction oldTransaction, Transaction newTransaction)
        {
            var args = new TransactionEventArgs(oldTransaction, newTransaction, type);
            foreach (var transactionEvent in Events)
            {
                await transactionEvent.Execute(args);
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