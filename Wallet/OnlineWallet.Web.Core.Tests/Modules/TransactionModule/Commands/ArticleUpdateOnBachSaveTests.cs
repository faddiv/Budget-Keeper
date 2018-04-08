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
    [Collection("Database collection")]
    public class ArticleUpdateOnBachSaveTests : IDisposable
    {
        private readonly ServicesFixture _fixture;
        private readonly IBatchSaveCommand _instance;
        private readonly TransactionBuilder _transactionBuilder;

        public ArticleUpdateOnBachSaveTests(DatabaseFixture fixture)
        {
            _fixture = fixture.CreateServiceFixture(e =>
                {
                    e.RemoveAll(descriptor => descriptor.ServiceType == typeof(IBatchSaveEvent));
                    e.AddScoped<IBatchSaveEvent, ArticleUpdateOnBachSave>();
                });
            _instance = _fixture.GetService<IBatchSaveCommand>();
            _transactionBuilder = new TransactionBuilder()
                .WithContinousWallet(_fixture.DbContext);
        }

        public void Dispose()
        {
            _fixture?.Cleanup();
        }

        [Fact(DisplayName = nameof(Adds_new_article_on_new_transaction))]
        public async Task Adds_new_article_on_new_transaction()
        {
            //Arrange
            var transaction = _transactionBuilder.Build();
            //Act
            var batch = new TransactionOperationBatch(transaction);
            await Execute(batch);
            //Assert
            var article = _fixture.DbContext.Article.Find(transaction.Name);
            article.Should().NotBeNull();
            article.Name.Should().Be(transaction.Name);
            article.Occurence.Should().Be(1);
            article.Category.Should().Be(transaction.Category);
            article.LastPrice.Should().Be(transaction.Value);
            article.LastUpdate.Should().Be(transaction.CreatedAt);
            article.LastWalletId.Should().Be(transaction.WalletId);
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
            var batch = new TransactionOperationBatch(transaction1);
            await Execute(batch);
            //Act
            batch = new TransactionOperationBatch(transaction2);
            await Execute(batch);
            //Assert
            var article = _fixture.DbContext.Article.Find(transaction2.Name);
            article.Should().NotBeNull();
            article.Name.Should().Be(transaction2.Name);
            article.Occurence.Should().Be(2);
            article.Category.Should().Be(transaction2.Category);
            article.LastPrice.Should().Be(transaction2.Value);
            article.LastUpdate.Should().Be(transaction2.CreatedAt);
            article.LastWalletId.Should().Be(transaction2.WalletId);
        }

        [Fact(DisplayName = nameof(occurence_is_correct_on_more_new_transaction))]
        public async Task occurence_is_correct_on_more_new_transaction()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            //Act
            var batch = new TransactionOperationBatch(transaction1, transaction2);
            await Execute(batch);
            //Assert
            var article = _fixture.DbContext.Article.Find(transaction2.Name);
            article.Should().NotBeNull();
            article.Name.Should().Be(transaction2.Name);
            article.Occurence.Should().Be(2);
            article.Category.Should().Be(transaction2.Category);
            article.LastPrice.Should().Be(transaction2.Value);
            article.LastUpdate.Should().Be(transaction2.CreatedAt);
            article.LastWalletId.Should().Be(transaction2.WalletId);
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
            var batch = new TransactionOperationBatch(transaction1);
            await Execute(batch);
            transaction2.TransactionId = transaction1.TransactionId;
            //Act
            batch = new TransactionOperationBatch(transaction2);
            await Execute(batch);
            //Assert
            var article = _fixture.DbContext.Article.Find(transaction2.Name);
            article.Should().NotBeNull();
            article.Name.Should().Be(transaction2.Name);
            article.Occurence.Should().Be(1);
            article.Category.Should().Be(transaction2.Category);
            article.LastPrice.Should().Be(transaction2.Value);
            article.LastUpdate.Should().Be(transaction2.CreatedAt);
            article.LastWalletId.Should().Be(transaction2.WalletId);
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
            var batch = new TransactionOperationBatch(transaction1);
            await Execute(batch);
            transaction2.TransactionId = transaction1.TransactionId;
            //Act
            batch = new TransactionOperationBatch(transaction2);
            await Execute(batch);
            //Assert
            var article = _fixture.DbContext.Article.Find(transaction2.Name);
            article.Should().NotBeNull();
            article.Name.Should().Be(transaction1.Name);
            article.Occurence.Should().Be(1);
            article.Category.Should().Be(transaction1.Category);
            article.LastPrice.Should().Be(transaction1.Value);
            article.LastUpdate.Should().Be(transaction1.CreatedAt);
            article.LastWalletId.Should().Be(transaction1.WalletId);
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
            var batch = new TransactionOperationBatch(transaction1, transaction2);
            await Execute(batch);
            //Act
            batch = new TransactionOperationBatch(transaction2.TransactionId);
            await Execute(batch);
            //Assert
            var article = _fixture.DbContext.Article.Find(transaction1.Name);
            article.Should().NotBeNull();
            article.Name.Should().Be(transaction1.Name);
            article.Occurence.Should().Be(1);
            article.Category.Should().Be(transaction1.Category);
            article.LastPrice.Should().Be(transaction1.Value);
            article.LastUpdate.Should().Be(transaction1.CreatedAt);
            article.LastWalletId.Should().Be(transaction1.WalletId);
        }

        [Fact(DisplayName = nameof(Transaction_name_change_Scenario1))]
        public async Task Transaction_name_change_Scenario1()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction1Orig = _fixture.Clone(transaction1);
            var transaction2 = _transactionBuilder
                .WithName("Article2").WithCreatedAt(2017, 2)
                .Build();
            var batch = new TransactionOperationBatch(transaction1);
            await Execute(batch);
            transaction2.TransactionId = transaction1.TransactionId;
            //Act
            batch = new TransactionOperationBatch(transaction2);
            await Execute(batch);
            //Assert
            var article1 = _fixture.DbContext.Article.Find(transaction1Orig.Name);
            article1.Should().BeNull();
            var article2 = _fixture.DbContext.Article.Find(transaction2.Name);
            article2.Should().NotBeNull();
            article2.Name.Should().Be(transaction2.Name);
            article2.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(Transaction_name_change_Scenario2))]
        public async Task Transaction_name_change_Scenario2()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 2)
                .Build();
            var transaction1Orig = _fixture.Clone(transaction1);
            var transaction3 = _transactionBuilder
                .WithName("Article2").WithCreatedAt(2017, 2)
                .Build();
            var batch = new TransactionOperationBatch(transaction1, transaction2);
            await Execute(batch);
            transaction3.TransactionId = transaction2.TransactionId;
            //Act
            batch = new TransactionOperationBatch(transaction3);
            await Execute(batch);
            //Assert
            var article1 = _fixture.DbContext.Article.Find(transaction1Orig.Name);
            article1.Should().NotBeNull();
            article1.Name.Should().Be(transaction1Orig.Name);
            article1.Occurence.Should().Be(1);
            var article2 = _fixture.DbContext.Article.Find(transaction2.Name);
            article2.Should().NotBeNull();
            article2.Name.Should().Be(transaction2.Name);
            article2.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(Transaction_name_change_Scenario3))]
        public async Task Transaction_name_change_Scenario3()
        {
            //Arrange
            var transaction1 = _transactionBuilder
                .WithName("Article1").WithCreatedAt(2017, 1)
                .Build();
            var transaction2 = _transactionBuilder
                .WithName("Article2").WithCreatedAt(2017, 2)
                .Build();
            var transaction1Orig = _fixture.Clone(transaction1);
            var transaction3 = _transactionBuilder
                .WithName("Article2").WithCreatedAt(2017, 2)
                .Build();
            var batch = new TransactionOperationBatch(transaction1, transaction2);
            await Execute(batch);
            transaction3.TransactionId = transaction1.TransactionId;
            //Act
            batch = new TransactionOperationBatch(transaction3);
            await Execute(batch);
            //Assert
            var article1 = _fixture.DbContext.Article.Find(transaction1Orig.Name);
            article1.Should().BeNull();
            var article2 = _fixture.DbContext.Article.Find(transaction2.Name);
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
            var batch = new TransactionOperationBatch(transaction1, transaction2);
            await Execute(batch);
            //Act
            batch = new TransactionOperationBatch(transaction2.TransactionId);
            await Execute(batch);
            //Assert
            var article = _fixture.DbContext.Article.Find(transaction1.Name);
            article.Should().NotBeNull();
            article.Name.Should().Be(transaction1.Name);
            article.Occurence.Should().Be(1);
            article.Category.Should().Be(transaction1.Category);
            article.LastPrice.Should().Be(transaction1.Value);
            article.LastUpdate.Should().Be(transaction1.CreatedAt);
            article.LastWalletId.Should().Be(transaction1.WalletId);
        }

        [Fact(DisplayName = nameof(Removes_article_if_no_more_transaction))]
        public async Task Removes_article_if_no_more_transaction()
        {
            //Arrange
            var transaction = _transactionBuilder.Build();
            var batch = new TransactionOperationBatch(saves: transaction);
            await Execute(batch);
            //Act
            batch = new TransactionOperationBatch(delete: transaction.TransactionId);
            await Execute(batch);
            //Assert
            var article = _fixture.DbContext.Article.Find(transaction.Name);
            article.Should().BeNull();
        }

        private async Task Execute(TransactionOperationBatch args)
        {
            await _instance.Execute(args, CancellationToken.None);
        }
    }
}