using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule.Models;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    public class TransactionCommand : ITransactionCommand
    {
        #region Fields

        private readonly IWalletDbContext _db;

        #endregion

        #region  Constructors

        public TransactionCommand(IWalletDbContext db, ITransactionEvent events)
        {
            _db = db;
            Events = events;
        }

        #endregion

        public ITransactionEvent Events { get; }

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

                    //Too slow. Need to be replaced with a custom solution. (And should make multi threaded)
                    _db.UpdateEntityValues(existingEntity, operation);
                }
                else
                {
                    await _db.Transactions.AddAsync(operation, token);
                    token.ThrowIfCancellationRequested();
                }
            }

            foreach (var id in model.Delete)
            {
                var existingEntity = existingEntities.Find(e => e.TransactionId == id);
                if (existingEntity != null)
                {
                    _db.Transactions.Remove(existingEntity);
                }
            }

            await _db.SaveChangesAsync(token);
        }

        #endregion
    }


    public interface ITransactionCommand
    {
        #region  Public Methods

        Task Execute(TransactionOperationBatch model, CancellationToken token);

        #endregion
    }
}