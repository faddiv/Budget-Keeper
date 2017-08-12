namespace OnlineWallet.Web.QueryLanguage.Conditions
{
    public class SearchTermCondition : ICondition
    {

        public SearchTermCondition(string searchTerm)
        {
            SearchTerm = searchTerm;
        }

        public string SearchTerm { get; }

        public override string ToString()
        {
            return SearchTerm;
        }
    }
}