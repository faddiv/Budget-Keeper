using System.Collections.Generic;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    public class TransactionOperationBatch
    {
        public List<Transaction> Save { get; set; }
        public List<long> Delete { get; set; }
    }
}
