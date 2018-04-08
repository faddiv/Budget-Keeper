using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Queries
{
    [Trait(nameof(Queries.ArticleQueries), nameof(Queries.ArticleQueries.GetByName))]
    [Collection("Database collection")]
    public class ArticleQueriesGetByNameTests : ArticleQueriesTests
    {
        #region  Constructors

        public ArticleQueriesGetByNameTests(DatabaseFixture fixture)
            : base(fixture)
        {
            var articleBuilder = new ArticleBuilder();
            Fixture.DbContext.Article.Add(articleBuilder.WithName(ArticleName).Build());
            Fixture.DbContext.SaveChanges();
        }

        #endregion

        #region  Public Methods

        [Fact(DisplayName = nameof(Is_case_sensitive))]
        public async Task Is_case_sensitive()
        {
            //Act
            var result = await ArticleQueries.GetByName(ArticleName.ToUpper(), CancellationToken.None);

            //Assert
            result.Should().BeNull();
        }

        [Fact(DisplayName = nameof(Returns_article_data_if_found))]
        public async Task Returns_article_data_if_found()
        {
            //Act
            var result = await ArticleQueries.GetByName(ArticleName, CancellationToken.None);

            //Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(ArticleName);
        }

        [Fact(DisplayName = nameof(Returns_null_on_null_name))]
        public async Task Returns_null_on_empty_name()
        {
            //Act
            var result = await ArticleQueries.GetByName(string.Empty, CancellationToken.None);

            //Assert
            result.Should().BeNull();
        }

        [Fact(DisplayName = nameof(Returns_null_on_null_name))]
        public async Task Returns_null_on_null_name()
        {
            //Act
            var result = await ArticleQueries.GetByName(null, CancellationToken.None);

            //Assert
            result.Should().BeNull();
        }

        #endregion
    }
}