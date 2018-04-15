using System.Collections.Generic;

namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public class TransactionEventArgs
    {
        #region  Constructors

        public TransactionEventArgs(List<TransactionOperation> operations)
        {
            Operations = operations;
        }

        #endregion

        #region Properties

        public List<TransactionOperation> Operations { get; }

        #endregion
    }
}