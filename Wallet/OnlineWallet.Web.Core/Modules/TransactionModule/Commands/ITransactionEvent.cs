
using OnlineWallet.Web.Modules.TransactionModule.Models;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    public interface ITransactionEvent
    {
        void Execute(TransactionEventArgs args);
    }
}
