using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using TestStack.Dossier.Lists;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    [Trait(nameof(ArticleController), nameof(ArticleController.SyncFromTransactions))]
    [Collection("Database collection")]
    public class ArticleControllerSyncFromTransactionsTests : IDisposable
    {
        private readonly ServicesFixture _fixture;
        private readonly ArticleController _controller;

        public ArticleControllerSyncFromTransactionsTests(DatabaseFixture fixture)
        {
            _fixture = fixture.CreateServiceFixture();
            _controller = _fixture.GetService<ArticleController>();
        }

        public void Dispose()
        {
            _fixture.Cleanup();
        }

        [Fact(DisplayName = nameof(Updates_all_article_if_no_parameter_provided))]
        public async Task Updates_all_article_if_no_parameter_provided()
        {
            _fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(10).BuildList());
            _fixture.DbContext.SaveChanges();

            var result = await _controller.SyncFromTransactions();

            result.Should().BeOfType<OkResult>();
            var articles = _fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(_fixture.DbContext.Transactions.Select(e => e.Name).Distinct().Count());
        }

        [Fact(DisplayName = nameof(Updates_only_given_articles_if_provided))]
        public async Task Updates_only_given_articles_if_provided()
        {
            _fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(10)
                .TheFirst(1).WithName("alfa")
                .TheNext(1).WithName("beta")
                .BuildList());
            _fixture.DbContext.SaveChanges();

            var result = await _controller.SyncFromTransactions(new List<string> { "alfa", "beta" });

            result.Should().BeOfType<OkResult>();
            var articles = _fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(2);
        }
    }
}
