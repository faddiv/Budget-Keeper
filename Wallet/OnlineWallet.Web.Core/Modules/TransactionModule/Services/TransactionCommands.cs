using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule.Models;

namespace OnlineWallet.Web.Modules.TransactionModule.Services
{
    public class BatchSaveCommand : IBatchSaveCommand
    {
        #region Fields

        private readonly IWalletDbContext db;

        #endregion

        #region  Constructors

        public BatchSaveCommand(IWalletDbContext db)
        {
            this.db = db;
        }

        #endregion

        #region  Public Methods

        public async Task Execute(TransactionOperationBatch model, CancellationToken token)
        {
            var existingIds = model.Save.Where(e => e.TransactionId > 0).Select(e => e.TransactionId).ToList();
            existingIds.AddRange(model.Delete);
            var existingEntities = db.Transactions.Where(e => existingIds.Contains(e.TransactionId)).ToList();
            foreach (var operation in model.Save)
            {
                operation.CreatedAt = operation.CreatedAt.Date;
                if (operation.TransactionId != 0)
                {
                    var existingEntity = existingEntities.Find(e => e.TransactionId == operation.TransactionId);
                    if (existingEntity == null)
                    {
                        throw new Exception("Money operation doesn't exists");
                    }
                    //Too slow. Need to be replaced with a custom solution. (And should make multi threaded)
                    db.UpdateEntityValues(existingEntity, operation);
                }
                else
                {
                    await db.Transactions.AddAsync(operation, token);
                    token.ThrowIfCancellationRequested();
                }
            }
            foreach (var id in model.Delete)
            {
                var existingEntity = existingEntities.Find(e => e.TransactionId == id);
                if (existingEntity != null)
                {
                    db.Transactions.Remove(existingEntity);
                }
            }
            await db.SaveChangesAsync(token);
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