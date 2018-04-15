using System.Threading;
using System.Threading.Tasks;
using OnlineWallet.Web.Modules.TransactionModule.Models;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    public interface IBatchSaveEvent
    {
        #region  Public Methods

        Task AfterSave(TransactionEventArgs operations, CancellationToken token);
        Task BeforeSave(TransactionEventArgs operations, CancellationToken token);

        #endregion
    }
}