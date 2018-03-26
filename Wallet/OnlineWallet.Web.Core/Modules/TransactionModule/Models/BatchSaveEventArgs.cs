using OnlineWallet.Web.DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public class BatchSaveEventArgs
    {
        public BatchSaveEventArgs(
            Transaction oldTransaction,
            Transaction newTransaction,
            BatchSaveOperationType operationType)
        {
            OldTransaction = oldTransaction;
            NewTransaction = newTransaction;
            OperationType = operationType;
        }

        public Transaction OldTransaction { get; }
        public Transaction NewTransaction { get; }
        public BatchSaveOperationType OperationType { get; }
    }
}
