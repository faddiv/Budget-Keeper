using System;
using System.Linq.Expressions;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Models.Queries;
using OnlineWallet.Web.QueryLanguage.Conditions;

namespace OnlineWallet.Web.Modules.WalletModule
{
    public class WalletConditionBuilder : ConditionVisitorBase<Wallet>
    {
        protected override Expression<Func<Wallet, bool>> VisitSearchTermCondition(SearchTermCondition condition)
        {
            return wallet => wallet.Name.Contains(condition.SearchTerm);
        }
    }
}