using System.Text;

namespace OnlineWallet.Web.QueryLanguage.Conditions
{
    public class SearchTermCondition : CommonCondition
    {
        #region  Constructors

        public SearchTermCondition(string searchTerm)
        {
            SearchTerm = searchTerm;
        }

        #endregion

        #region Properties

        public string SearchTerm { get; }

        #endregion

        #region  Nonpublic Methods

        internal override void ToStringInternal(StringBuilder builder, bool topLevel)
        {
            builder.Append(SearchTerm);
        }

        #endregion
    }
}