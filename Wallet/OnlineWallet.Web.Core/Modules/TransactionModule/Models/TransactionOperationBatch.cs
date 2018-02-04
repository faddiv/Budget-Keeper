using System.Collections.Generic;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public class TransactionOperationBatch
    {
        #region Properties

        public List<long> Delete { get; set; }
        public List<Transaction> Save { get; set; }

        #endregion
    }
}