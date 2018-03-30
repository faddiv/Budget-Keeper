
using OnlineWallet.Web.Modules.TransactionModule.Models;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    public interface IBatchSaveEvent
    {
        void Execute(TransactionEventArgs args);
    }
}
