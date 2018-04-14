using System.Collections.Generic;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public class TransactionOperationBatch
    {
        #region  Constructors

        public TransactionOperationBatch()
        {
        }

        public TransactionOperationBatch(IList<Transaction> save, IList<long> delete)
        {
            Save = save;
            Delete = delete;
        }

        #endregion

        #region Properties

        public IList<long> Delete { get; set; }
        public IList<Transaction> Save { get; set; }

        #endregion

        #region  Public Methods

        public static TransactionOperationBatch DeleteBatch(IList<long> delete)
        {
            return new TransactionOperationBatch(new List<Transaction>(), delete);
        }

        public static TransactionOperationBatch DeleteBatch(params long[] delete)
        {
            return new TransactionOperationBatch(new List<Transaction>(), delete);
        }

        public static TransactionOperationBatch SaveBatch(IList<Transaction> save)
        {
            return new TransactionOperationBatch(save, new List<long>());
        }

        public static TransactionOperationBatch SaveBatch(params Transaction[] save)
        {
            return new TransactionOperationBatch(save, new List<long>());
        }

        #endregion
    }
}