
using System.Threading.Tasks;
using OnlineWallet.Web.Modules.TransactionModule.Models;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    public interface IBatchSaveEvent
    {
        Task Execute(TransactionEventArgs args);
    }
}
