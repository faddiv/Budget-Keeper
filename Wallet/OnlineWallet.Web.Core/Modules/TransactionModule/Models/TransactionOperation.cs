using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public class TransactionOperation
    {
        #region  Constructors

        public TransactionOperation(
            Transaction oldTransaction,
            Transaction newTransaction,
            BatchSaveOperationType operationType)
        {
            OldTransaction = oldTransaction;
            NewTransaction = newTransaction;
            OperationType = operationType;
        }

        #endregion

        #region Properties

        public Transaction NewTransaction { get; }

        public Transaction OldTransaction { get; }
        public BatchSaveOperationType OperationType { get; }

        #endregion
    }
}