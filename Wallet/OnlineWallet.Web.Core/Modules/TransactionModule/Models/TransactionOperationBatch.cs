using System.Collections.Generic;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public class TransactionOperationBatch
    {
        public TransactionOperationBatch()
        {
        }

        public TransactionOperationBatch(IList<Transaction> save) :
            this(save, new List<long>())
        {
        }

        public TransactionOperationBatch(params Transaction[] saves) :
            this(saves, new List<long>())
        {
        }

        public TransactionOperationBatch(IList<long> delete) :
            this(new List<Transaction>(), delete)
        {
        }

        public TransactionOperationBatch(params long[] delete) :
            this(new List<Transaction>(), delete)
        {
        }

        public TransactionOperationBatch(IList<Transaction> save, IList<long> delete)
        {
            Save = save;
            Delete = delete;
        }

        #region Properties

        public IList<long> Delete { get; set; }
        public IList<Transaction> Save { get; set; }

        #endregion
    }
}