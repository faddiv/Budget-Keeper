using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Queries
{
    [Trait(nameof(ArticleQueries), nameof(ArticleQueries.GetByName))]
    [Collection("Database collection")]
    public class ArticleQueriesGetByNameTests : IDisposable
    {
        private readonly ServicesFixture _fixture;
        private readonly IArticleQueries _articleQueries;
        private const string ArticleName = "TestArticle";

        public ArticleQueriesGetByNameTests(DatabaseFixture fixture)
        {
            _fixture = fixture.CreateServiceFixture();
            var articleBuilder = new ArticleBuilder();
            _fixture.DbContext.Article.Add(articleBuilder.WithName(ArticleName).Build());
            _fixture.DbContext.SaveChanges();
            _articleQueries = _fixture.GetService<IArticleQueries>();
        }

        public void Dispose()
        {
            _fixture?.Cleanup();
        }

        [Fact(DisplayName = nameof(Returns_article_data_if_found))]
        public async Task Returns_article_data_if_found()
        {
            //Act
            var result = await _articleQueries.GetByName(ArticleName, CancellationToken.None);

            //Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(ArticleName);
        }

        [Fact(DisplayName = nameof(Is_case_sensitive))]
        public async Task Is_case_sensitive()
        {
            //Act
            var result = await _articleQueries.GetByName(ArticleName.ToUpper(), CancellationToken.None);

            //Assert
            result.Should().BeNull();
        }
    }
}
