using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule.Commands
{
    [Trait(nameof(ArticleUpdateOnBachSave), null)]
    public class ArticleUpdateOnBachSaveTests : ServiceTestBase
    {
        private readonly IBatchSaveCommand _instance;
        private readonly TransactionBuilder _transactionBuilder;

        public ArticleUpdateOnBachSaveTests()
        {
            _instance = Fixture.GetService<IBatchSaveCommand>();
            _transactionBuilder = new TransactionBuilder()
                .WithContinousWallet(Fixture.DbContext);
        }

        protected override TestServices Setup(TestServiceProviderFixture provider)
        {
            return provider.CreateServiceFixture(e =>
            {
                e.RemoveAll(descriptor => descriptor.ServiceType == typeof(IBatchSaveEvent));
                e.AddScoped<IBatchSaveEvent, ArticleUpdateOnBachSave>();
            });
        }
        
        [Fact(DisplayName = nameof(Adds_new_article_on_new_transaction))]
        public async Task Adds_new_article_on_new_transaction()
        {
            //Arrange
            var transaction = _transactionBuilder.Build();
            //Act
            var batch = TransactionOperationBatch.SaveBatch(transaction);
            await Execute(batch);
            //Assert
            var article = Fixture.DbContext.Article.Find(transaction.Name);
            article.Should().NotBeNull();
            article.Should().BasedOn(transaction);
            article.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(Updates_existing_article_on_new_transaction))]
        public async Task Updates_existing_article_on_new_transaction()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017,1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            var batch = TransactionOperationBatch.SaveBatch(transaction1);
            await Execute(batch);
            //Act
            batch = TransactionOperationBatch.SaveBatch(transaction2);
            await Execute(batch);
            //Assert
            var article = Fixture.DbContext.Article.Find(transaction2.Name);
            article.Should().NotBeNull();
            article.Should().BasedOn(transaction2);
            article.Occurence.Should().Be(2);
        }

        [Fact(DisplayName = nameof(Occurence_is_correct_on_more_new_transaction))]
        public async Task Occurence_is_correct_on_more_new_transaction()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            //Act
            var batch = TransactionOperationBatch.SaveBatch(transaction1, transaction2);
            await Execute(batch);
            //Assert
            var article = Fixture.DbContext.Article.Find(transaction2.Name);
            article.Should().NotBeNull();
            article.Should().BasedOn(transaction2);
            article.Occurence.Should().Be(2);
        }

        [Fact(DisplayName = nameof(Occurence_is_correct_on_new_and_updated_transaction))]
        public async Task Occurence_is_correct_on_new_and_updated_transaction()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            var transaction3 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 3)
                .Build();

            var batch = TransactionOperationBatch.SaveBatch(transaction1);
            await Execute(batch);
            transaction2.TransactionId = transaction1.TransactionId;
            //Act
            batch = TransactionOperationBatch.SaveBatch(transaction3, transaction2);
            await Execute(batch);
            //Assert
            var article = Fixture.DbContext.Article.Find(transaction3.Name);
            article.Should().NotBeNull();
            article.Should().BasedOn(transaction3);
            article.Occurence.Should().Be(2);
        }

        [Fact(DisplayName = nameof(Updates_existing_article_on_update_transaction_if_newer))]
        public async Task Updates_existing_article_on_update_transaction_if_newer()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            var batch = TransactionOperationBatch.SaveBatch(transaction1);
            await Execute(batch);
            transaction2.TransactionId = transaction1.TransactionId;
            //Act
            batch = TransactionOperationBatch.SaveBatch(transaction2);
            await Execute(batch);
            //Assert
            var article = Fixture.DbContext.Article.Find(transaction2.Name);
            article.Should().NotBeNull();
            article.Should().BasedOn(transaction2);
            article.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(Updates_existing_article_on_update_transaction_on_mixing_date))]
        public async Task Updates_existing_article_on_update_transaction_on_mixing_date()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            var batch = TransactionOperationBatch.SaveBatch(transaction1, transaction2);
            await Execute(batch);
            //Act
            transaction1 = Fixture.Clone(transaction1);
            transaction2 = Fixture.Clone(transaction2);
            transaction1.CreatedAt = new DateTime(2017, 3, 11);
            transaction2.CreatedAt = new DateTime(2017, 1, 1);
            batch = TransactionOperationBatch.SaveBatch(transaction1, transaction2);
            await Execute(batch);
            //Assert
            var article = Fixture.DbContext.Article.Find(transaction1.Name);
            article.Should().NotBeNull();
            article.Should().BasedOn(transaction1);
            article.Occurence.Should().Be(2);
        }

        [Fact(DisplayName = nameof(Leave_existing_article_on_update_transaction_if_older))]
        public async Task Leave_existing_article_on_update_transaction_if_older()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var batch = TransactionOperationBatch.SaveBatch(transaction1);
            await Execute(batch);
            transaction2.TransactionId = transaction1.TransactionId;
            //Act
            batch = TransactionOperationBatch.SaveBatch(transaction2);
            await Execute(batch);
            //Assert
            var article = Fixture.DbContext.Article.Find(transaction2.Name);
            article.Should().NotBeNull();
            article.Should().BasedOn(transaction1);
            article.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(Updates_existing_article_on_delete_transaction_if_newer))]
        public async Task Updates_existing_article_on_delete_transaction_if_newer()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            var batch = TransactionOperationBatch.SaveBatch(transaction1, transaction2);
            await Execute(batch);
            //Act
            batch = TransactionOperationBatch.DeleteBatch(transaction2.TransactionId);
            await Execute(batch);
            //Assert
            var article = Fixture.DbContext.Article.Find(transaction1.Name);
            article.Should().NotBeNull();
            article.Should().BasedOn(transaction1);
            article.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(Transaction_name_change_for_all_article))]
        public async Task Transaction_name_change_for_all_article()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction1Orig = Fixture.Clone(transaction1);
            var transaction2 = _transactionBuilder
                .WithName("Article2").WithCreatedAt(2017, 2)
                .Build();
            var batch = TransactionOperationBatch.SaveBatch(transaction1);
            await Execute(batch);
            transaction2.TransactionId = transaction1.TransactionId;
            //Act
            batch = TransactionOperationBatch.SaveBatch(transaction2);
            await Execute(batch);
            //Assert
            var article1 = Fixture.DbContext.Article.Find(transaction1Orig.Name);
            article1.Should().BeNull();
            var article2 = Fixture.DbContext.Article.Find(transaction2.Name);
            article2.Should().NotBeNull();
            article2.Name.Should().Be(transaction2.Name);
            article2.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(Transaction_name_change_one_with_new_name))]
        public async Task Transaction_name_change_one_with_new_name()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            var transaction1Orig = Fixture.Clone(transaction1);
            var transaction3 = _transactionBuilder
                .WithName("Article2").WithCreatedAt(2017, 2)
                .Build();
            var batch = TransactionOperationBatch.SaveBatch(transaction1, transaction2);
            await Execute(batch);
            transaction3.TransactionId = transaction2.TransactionId;
            //Act
            batch = TransactionOperationBatch.SaveBatch(transaction3);
            await Execute(batch);
            //Assert
            var article1 = Fixture.DbContext.Article.Find(transaction1Orig.Name);
            article1.Should().NotBeNull();
            article1.Name.Should().Be(transaction1Orig.Name);
            article1.Occurence.Should().Be(1);
            var article2 = Fixture.DbContext.Article.Find(transaction2.Name);
            article2.Should().NotBeNull();
            article2.Name.Should().Be(transaction2.Name);
            article2.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(Transaction_name_change_last_article_to_existing))]
        public async Task Transaction_name_change_last_article_to_existing()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article2").WithCreatedAt(2017, 2)
                .Build();
            var transaction1Orig = Fixture.Clone(transaction1);
            var transaction3 = _transactionBuilder
                .WithName("Article2").WithCreatedAt(2017, 2)
                .Build();
            var batch = TransactionOperationBatch.SaveBatch(transaction1, transaction2);
            await Execute(batch);
            transaction3.TransactionId = transaction1.TransactionId;
            //Act
            batch = TransactionOperationBatch.SaveBatch(transaction3);
            await Execute(batch);
            //Assert
            var article1 = Fixture.DbContext.Article.Find(transaction1Orig.Name);
            article1.Should().BeNull();
            var article2 = Fixture.DbContext.Article.Find(transaction2.Name);
            article2.Should().NotBeNull();
            article2.Name.Should().Be(transaction2.Name);
            article2.Occurence.Should().Be(2);
        }

        [Fact(DisplayName = nameof(Leave_existing_article_on_delete_transaction_if_older))]
        public async Task Leave_existing_article_on_delete_transaction_if_older()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var batch = TransactionOperationBatch.SaveBatch(transaction1, transaction2);
            await Execute(batch);
            //Act
            batch = TransactionOperationBatch.DeleteBatch(transaction2.TransactionId);
            await Execute(batch);
            //Assert
            var article = Fixture.DbContext.Article.Find(transaction1.Name);
            article.Should().NotBeNull();
            article.Should().BasedOn(transaction1);
            article.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(Removes_article_if_no_more_transaction))]
        public async Task Removes_article_if_no_more_transaction()
        {
            //Arrange
            var transaction = _transactionBuilder.Build();
            var batch = TransactionOperationBatch.SaveBatch(transaction);
            await Execute(batch);
            //Act
            batch = TransactionOperationBatch.DeleteBatch(delete: transaction.TransactionId);
            await Execute(batch);
            //Assert
            var article = Fixture.DbContext.Article.Find(transaction.Name);
            article.Should().BeNull();
        }

        private async Task Execute(TransactionOperationBatch args)
        {
            await _instance.Execute(args, CancellationToken.None);
        }
    }
}