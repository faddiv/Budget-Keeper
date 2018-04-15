using OnlineWallet.Web.TestHelpers;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Queries
{
    public class ArticleQueriesTests : ServiceTestBase
    {
        public IArticleQueries ArticleQueries { get; }
        protected const string ArticleName = "TestArticle";

        public ArticleQueriesTests()
        {
            ArticleQueries = Fixture.GetService<IArticleQueries>();
        }
        
    }
}