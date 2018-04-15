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

        public static ArticleListAssertion Should(this List<Article> article)
        {
            return new ArticleListAssertion(article);
        }

        #endregion
    }
}