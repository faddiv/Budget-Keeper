using FluentAssertions;
using OnlineWallet.Web.DataLayer;
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
            _fixture?.Cleanup();
        }

        [Fact(DisplayName = nameof(Inserts_all_new_article_if_null_provided))]
        public async Task Inserts_all_new_article_if_null_provided()
        {
            // Arrange
            _fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(10).BuildList());
            _fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            // Assert
            var articles = _fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(_fixture.DbContext.Transactions.Select(e => e.Name).Distinct().Count());
        }

        [Fact(DisplayName = nameof(Inserts_only_given_articles_if_provided))]
        public async Task Inserts_only_given_articles_if_provided()
        {
            // Arrange
            _fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(10)
                .TheFirst(1).WithName("alfa")
                .TheNext(1).WithName("beta")
                .BuildList());
            _fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(new List<string> { "alfa", "beta" }, CancellationToken.None);

            // Assert
            var articles = _fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(2);
        }

        [Fact(DisplayName = nameof(Updates_all_article_on_null_param))]
        public async Task Updates_all_article_on_null_param()
        {
            // Arrange
            var trans = TransactionBuilder.CreateListOfSize(10).BuildList();
            var articles = trans.Select(e => new Article { Name = e.Name }).ToList();
            _fixture.DbContext.Transactions.AddRange(trans);
            _fixture.DbContext.Article.AddRange(articles);
            _fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            // Assert
            articles = _fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(trans.Count);
            foreach (var article in articles)
            {
                var transaction = trans.FirstOrDefault(e => e.Name == article.Name);
                transaction.Should().NotBeNull();
                article.Should().BasedOn(transaction);
            }
        }

        [Fact(DisplayName = nameof(Updates_only_given_articles_if_provided))]
        public async Task Updates_only_given_articles_if_provided()
        {
            // Arrange
            var trans = TransactionBuilder.CreateListOfSize(10)
                .TheFirst(1).WithName("alfa")
                .TheNext(1).WithName("beta").BuildList();
            var articles = trans.Select(e => new Article
            {
                Name = e.Name,
                Category = String.Empty
            }).ToList();
            _fixture.DbContext.Transactions.AddRange(trans);
            _fixture.DbContext.Article.AddRange(articles);
            _fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(new List<string> { "alfa", "beta" }, CancellationToken.None);

            // Assert
            articles = _fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(trans.Count);
            foreach (var article in articles)
            {
                var transaction = trans.FirstOrDefault(e => e.Name == article.Name);
                transaction.Should().NotBeNull();
                if (article.Name == "alfa" ||
                    article.Name == "beta")
                {
                    article.Should().BasedOn(transaction);
                }
                else
                {
                    article.Category.Should().BeNullOrEmpty();
                }
            }
        }

        [Fact(DisplayName = nameof(Removes_non_existent_articles_if_null_provided))]
        public async Task Removes_non_existent_articles_if_null_provided()
        {
            // Arrange
            var trans = TransactionBuilder.CreateListOfSize(10).BuildList();
            var articles = trans.Select(e => new Article { Name = e.Name }).ToList();
            // Additional articles with no respective Transaction;
            articles.AddRange(ArticleBuilder.CreateListOfSize(5).BuildList());
            _fixture.DbContext.Transactions.AddRange(trans);
            _fixture.DbContext.Article.AddRange(articles);
            _fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            // Assert
            articles = _fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(trans.Count);
        }

        [Fact(DisplayName = nameof(Removal_affect_only_provided_article_if_article_names_provided))]
        public async Task Removal_affect_only_provided_article_if_article_names_provided()
        {
            // Arrange
            var trans = TransactionBuilder.CreateListOfSize(10).BuildList();
            var articles = trans.Select(e => new Article { Name = e.Name }).ToList();
            // Additional articles with no respective Transaction;
            articles.AddRange(ArticleBuilder.CreateListOfSize(5)
                .TheFirst(1).WithName("alfa")
                .TheNext(1).WithName("beta").BuildList());
            _fixture.DbContext.Transactions.AddRange(trans);
            _fixture.DbContext.Article.AddRange(articles);
            _fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(new List<string> { "alfa" }, CancellationToken.None);

            // Assert
            articles = _fixture.DbContext.Article.ToList();
            articles.Should().NotContain(e => e.Name == "alfa");
            articles.Should().Contain(e => e.Name == "beta");
        }


        [Fact(DisplayName = nameof(Considers_all_insert_and_delete_if_no_parameter_provided))]
        public async Task Considers_all_insert_and_delete_if_no_parameter_provided()
        {
            // Arrange
            var transactions = TransactionBuilder.CreateListOfSize(10).BuildList();
            var articleNamesToInsert = transactions.Select(e => e.Name).ToList();
            _fixture.DbContext.Transactions.AddRange(
                transactions);

            var articles = ArticleBuilder.CreateListOfSize(5).BuildList();
            var articleNamesToDelete = articles.Select(e => e.Name).ToList();
            _fixture.DbContext.Article.AddRange(
                articles);
            _fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            // Assert
            articles = _fixture.DbContext.Article.ToList();
            articles.Should().OnlyContain(e => articleNamesToInsert.Contains(e.Name));
            articles.Should().NotContain(e => articleNamesToDelete.Contains(e.Name));
        }
    }
}
