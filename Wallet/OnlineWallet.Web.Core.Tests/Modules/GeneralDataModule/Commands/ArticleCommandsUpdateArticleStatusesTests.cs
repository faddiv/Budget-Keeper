using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TestStack.Dossier.Lists;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Commands
{
    [Trait(nameof(ArticleCommands), nameof(ArticleCommands.UpdateArticleStatuses))]
    [Collection("Database collection")]
    public class ArticleCommandsUpdateArticleStatusesTests : IDisposable
    {
        private readonly ServicesFixture _fixture;
        private readonly IArticleCommands _articleCommands;

        public ArticleCommandsUpdateArticleStatusesTests(DatabaseFixture fixture)
        {
            _fixture = fixture.CreateServiceFixture();
            _articleCommands = _fixture.GetService<IArticleCommands>();
        }

        public void Dispose()
        {
            _fixture.Dispose();
        }

        [Fact(DisplayName = nameof(Inserts_all_new_article_if_null_provided))]
        public async Task Inserts_all_new_article_if_null_provided()
        {
            _fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(10).BuildList());
            _fixture.DbContext.SaveChanges();

            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            var articles = _fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(_fixture.DbContext.Transactions.Select(e => e.Name).Distinct().Count());
        }

        [Fact(DisplayName = nameof(Inserts_only_given_articles_if_provided))]
        public async Task Inserts_only_given_articles_if_provided()
        {
            _fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(10)
                .TheFirst(1).WithName("alfa")
                .TheNext(1).WithName("beta")
                .BuildList());
            _fixture.DbContext.SaveChanges();

            await _articleCommands.UpdateArticleStatuses(new List<string> { "alfa", "beta" }, CancellationToken.None);

            var articles = _fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(2);
        }

        [Fact(DisplayName = nameof(Updates_all_article_on_null_param))]
        public async Task Updates_all_article_on_null_param()
        {
            Xunit.Assert.True(false);
        }

        [Fact(DisplayName = nameof(Updates_only_given_articles_if_provided))]
        public async Task Updates_only_given_articles_if_provided()
        {
            Xunit.Assert.True(false);
        }

        [Fact(DisplayName = nameof(Removes_non_existent_articles_if_null_provided))]
        public async Task Removes_non_existent_articles_if_null_provided()
        {
            Xunit.Assert.True(false);
        }

        [Fact(DisplayName = nameof(Removal_affect_only_provided_article_if_article_names_provided))]
        public async Task Removal_affect_only_provided_article_if_article_names_provided()
        {
            Xunit.Assert.True(false);
        }
    }
}
