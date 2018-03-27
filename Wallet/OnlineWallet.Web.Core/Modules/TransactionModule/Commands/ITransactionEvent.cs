using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    public interface ITransactionEvent
    {
        void Execute(TransactionEventArgs args);
    }
}
