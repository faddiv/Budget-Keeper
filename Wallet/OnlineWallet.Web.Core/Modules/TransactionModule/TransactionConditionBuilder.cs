using System;
using System.Linq.Expressions;
using OnlineWallet.Web.Common.Queries;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.QueryLanguage.Conditions;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    public class TransactionConditionBuilder : ConditionVisitorBase<Transaction>
    {
        #region  Nonpublic Methods

        protected override Expression<Func<Transaction, bool>> VisitSearchTermCondition(
            SearchTermCondition condition)
        {
            return transaction => transaction.Name.Contains(condition.SearchTerm);
        }

        #endregion
    }
}