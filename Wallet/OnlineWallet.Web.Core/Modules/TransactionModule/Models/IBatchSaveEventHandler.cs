using OnlineWallet.Web.DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public interface IBatchSaveEventHandler
    {
        void Execute(BatchSaveEventArgs args);
    }
}
