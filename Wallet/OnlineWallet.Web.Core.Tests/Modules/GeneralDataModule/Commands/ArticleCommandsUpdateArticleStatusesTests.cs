using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using TestStack.Dossier.Lists;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Commands
{
    [Trait(nameof(ArticleCommands), nameof(ArticleCommands.UpdateArticleStatuses))]
    public class ArticleCommandsUpdateArticleStatusesTests : ServiceTestBase
    {
        private readonly IArticleCommands _articleCommands;

        public ArticleCommandsUpdateArticleStatusesTests()
        {
            _articleCommands = Fixture.GetService<IArticleCommands>();
        }

        public void Dispose()
        {
            Fixture?.Cleanup();
        }

        [Fact(DisplayName = nameof(Inserts_all_new_article_if_null_provided))]
        public async Task Inserts_all_new_article_if_null_provided()
        {
            // Arrange
            Fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(10).BuildList());
            Fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            // Assert
            var articles = Fixture.DbContext.Article.ToList();
            articles.Should().HaveDistinctArticleNamesOnlyFrom(Fixture.DbContext.Transactions);
        }

        [Fact(DisplayName = nameof(Inserts_only_given_articles_if_provided))]
        public async Task Inserts_only_given_articles_if_provided()
        {
            // Arrange
            Fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(10)
                .TheFirst(1).WithName("alfa")
                .TheNext(1).WithName("beta")
                .BuildList());
            Fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(new List<string> { "alfa", "beta" }, CancellationToken.None);

            // Assert
            var articles = Fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(2);
        }

        [Fact(DisplayName = nameof(Updates_all_article_on_null_param))]
        public async Task Updates_all_article_on_null_param()
        {
            // Arrange
            var trans = TransactionBuilder.CreateListOfSize(10).BuildList();
            Fixture.CreateArticlesFromTransactions(trans);
            Fixture.DbContext.Transactions.AddRange(trans);
            Fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            // Assert
            var articles = Fixture.DbContext.Article.ToList();
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
            Fixture.CreateArticlesFromTransactions(trans);
            Fixture.DbContext.Transactions.AddRange(trans);
            Fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(new List<string> { "alfa", "beta" }, CancellationToken.None);

            // Assert
            var articles = Fixture.DbContext.Article.ToList();
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
            Fixture.CreateArticlesFromTransactions(trans);
            // Additional articles with no respective Transaction;
            var articles = ArticleBuilder.CreateListOfSize(5).BuildList();
            Fixture.DbContext.Transactions.AddRange(trans);
            Fixture.DbContext.Article.AddRange(articles);
            Fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            // Assert
            articles = Fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(trans.Count);
        }

        [Fact(DisplayName = nameof(Removal_affect_only_provided_article_if_article_names_provided))]
        public async Task Removal_affect_only_provided_article_if_article_names_provided()
        {
            // Arrange
            var trans = TransactionBuilder.CreateListOfSize(10).BuildList();
            Fixture.CreateArticlesFromTransactions(trans);
            // Additional articles with no respective Transaction;
            var articles = ArticleBuilder.CreateListOfSize(5)
                .TheFirst(1).WithName("alfa")
                .TheNext(1).WithName("beta").BuildList();
            Fixture.DbContext.Transactions.AddRange(trans);
            Fixture.DbContext.Article.AddRange(articles);
            Fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(new List<string> { "alfa" }, CancellationToken.None);

            // Assert
            articles = Fixture.DbContext.Article.ToList();
            articles.Should().NotContain(e => e.Name == "alfa");
            articles.Should().Contain(e => e.Name == "beta");
        }


        [Fact(DisplayName = nameof(Considers_all_insert_and_delete_if_no_parameter_provided))]
        public async Task Considers_all_insert_and_delete_if_no_parameter_provided()
        {
            // Arrange
            var transactions = TransactionBuilder.CreateListOfSize(10).BuildList();
            var articleNamesToInsert = transactions.Select(e => e.Name).ToList();
            Fixture.DbContext.Transactions.AddRange(
                transactions);

            var articles = ArticleBuilder.CreateListOfSize(5).BuildList();
            var articleNamesToDelete = articles.Select(e => e.Name).ToList();
            Fixture.DbContext.Article.AddRange(
                articles);
            Fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            // Assert
            articles = Fixture.DbContext.Article.ToList();
            articles.Should().OnlyContain(e => articleNamesToInsert.Contains(e.Name));
            articles.Should().NotContain(e => articleNamesToDelete.Contains(e.Name));
        }
        
        [Fact(DisplayName = nameof(Calculates_occurence_correctly))]
        public async Task Calculates_occurence_correctly()
        {
            // Arrange
            Fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(10)
                .TheFirst(2).WithName("alfa")
                .TheNext(1).WithName("Alfa")
                .TheNext(7).WithName("beta")
                .BuildList());
            Fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            // Assert
            var articles = Fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(2);
            articles.Should().Contain(e => string.Equals(e.Name, "alfa", StringComparison.InvariantCultureIgnoreCase))
                .Which.Occurence.Should().Be(3);
            articles.Should().Contain(e => e.Name == "beta")
                .Which.Occurence.Should().Be(7);
        }

        [Fact(DisplayName = nameof(Dont_insert_case_insensitive_duplicate_if_article_names_provided))]
        public async Task Dont_insert_case_insensitive_duplicate_if_article_names_provided()
        {
            // Arrange
            Fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(10)
                .TheFirst(5).WithName("alfa")
                .TheNext(5).WithName("Alfa")
                .BuildList());
            Fixture.DbContext.SaveChanges();

            // Act
            await _articleCommands.UpdateArticleStatuses(new List<string>{"alfa", "Alfa"}, CancellationToken.None);

            // Assert
            var articles = Fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(1);
            articles.Should().Contain(e => string.Equals(e.Name, "alfa", StringComparison.InvariantCultureIgnoreCase))
                .Which.Occurence.Should().Be(10);
        }

        [Fact(DisplayName = nameof(Inserts_The_first_name_it_encounters))]
        public async Task Inserts_The_first_name_it_encounters()
        {
            // Arrange

            // Act
            Fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(5)
                .All().WithName("ALFA")
                .BuildList());
            Fixture.DbContext.SaveChanges();
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            Fixture.DbContext.Transactions.AddRange(TransactionBuilder.CreateListOfSize(5)
                .All().WithName("alfa")
                .BuildList());
            Fixture.DbContext.SaveChanges();
            await _articleCommands.UpdateArticleStatuses(null, CancellationToken.None);

            // Assert
            var articles = Fixture.DbContext.Article.ToList();
            articles.Should().HaveCount(1);
            articles.Should().Contain(e => e.Name == "ALFA")
                .Which.Occurence.Should().Be(10);
        }
    }
}
