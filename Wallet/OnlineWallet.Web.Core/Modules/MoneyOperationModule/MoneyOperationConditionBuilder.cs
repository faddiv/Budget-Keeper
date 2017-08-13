using System;
using System.Linq.Expressions;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Models.Queries;
using OnlineWallet.Web.QueryLanguage.Conditions;

namespace OnlineWallet.Web.Modules.MoneyOperationModule
{
    public class MoneyOperationConditionBuilder : ConditionVisitorBase<MoneyOperation>
    {
        protected override Expression<Func<MoneyOperation, bool>> VisitSearchTermCondition(SearchTermCondition condition)
        {
            return moneyOperation => moneyOperation.Name.Contains(condition.SearchTerm);
        }
    }
}