using OnlineWallet.Web.DataLayer;
using System;
using System.Collections.Generic;
using System.Text;

namespace OnlineWallet.Web.TestHelpers
{
    public static class ArticleAssertionExtensions
    {
        public static ArticleAssertion Should(this Article article)
        {
            return new ArticleAssertion(article);
        }
    }
}
