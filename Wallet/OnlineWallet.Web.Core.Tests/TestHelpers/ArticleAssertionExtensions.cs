using System.Collections.Generic;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.TestHelpers
{
    public static class ArticleAssertionExtensions
    {
        #region  Public Methods

        public static ArticleAssertion Should(this Article article)
        {
            return new ArticleAssertion(article);
        }

        public static ArticleListAssertion<TCollection> Should<TCollection>(this TCollection article)
            where TCollection : IEnumerable<Article>
        {
            return new ArticleListAssertion<TCollection>(article);
        }

        #endregion
    }
}
