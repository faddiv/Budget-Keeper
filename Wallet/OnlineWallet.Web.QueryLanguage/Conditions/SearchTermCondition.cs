using System;
using System.Text;

namespace OnlineWallet.Web.QueryLanguage.Conditions
{
    public class SearchTermCondition : CommonCondition
    {

        public SearchTermCondition(string searchTerm)
        {
            SearchTerm = searchTerm;
        }

        public string SearchTerm { get; }

        internal override void ToStringInternal(StringBuilder builder, bool topLevel)
        {
            builder.Append(SearchTerm);
        }
    }
}