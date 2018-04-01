using System.Collections.Generic;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public class TransactionOperationBatch
    {
        #region Properties

        public IList<long> Delete { get; set; }
        public IList<Transaction> Save { get; set; }

        #endregion
    }
}