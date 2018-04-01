using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait(nameof(TransactionController), nameof(TransactionController.BatchSave))]
    [Collection("Database collection")]
    public class TransactionControllerBatchSaveTests : TransactionControllerTests
    {
        private const string FirstArticleName = "first";
        private const string SecondArticleName = "second";
        private const string ExampleCategoryName = "cat";
        #region Fields

        private readonly Transaction _transaction1;
        private readonly Transaction _transaction2;
        private readonly Article _article1;
        private readonly Article _article2;

        #endregion

        #region  Constructors

        public TransactionControllerBatchSaveTests(DatabaseFixture fixture) : base(fixture)
        {
            _transaction1 = new Transaction
            {
                Name = FirstArticleName,
                Category = ExampleCategoryName,
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 101,
                WalletId = Fixture.WalletCash.MoneyWalletId
            };
            _transaction2 = new Transaction
            {
                Name = SecondArticleName,
                Category = ExampleCategoryName,
                Comment = "comment",
                CreatedAt = DateTime.Parse("2017-09-16"),
                Direction = MoneyDirection.Expense,
                Value = 102,
                WalletId = Fixture.WalletBankAccount.MoneyWalletId
            };
            DbSet.AddRange(_transaction1, _transaction2);
            _article1 = new Article
            {
                Name = FirstArticleName,
                Category = ExampleCategoryName,
                LastPrice = 101,
                LastUpdate = DateTime.Parse("2017-09-16"),
                LastWalletId = Fixture.WalletCash.MoneyWalletId,
                Occurence = 1
            };
            Fixture.DbContext.Article.Add(_article1);
            _article2 = new Article
            {
                Name = SecondArticleName,
                Category = ExampleCategoryName,
                LastPrice = 102,
                LastUpdate = DateTime.Parse("2017-09-16"),
                LastWalletId = Fixture.WalletBankAccount.MoneyWalletId,
                Occurence = 1
            };
            Fixture.DbContext.Article.Add(_article2);
            Fixture.DbContext.SaveChanges();
        }

        #endregion

        #region  Public Methods

        [Fact(DisplayName = nameof(Saves_new_Transactions))]
        public async Task Saves_new_Transactions()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
            var transactions = new TransactionOperationBatch(new List<Transaction>
            {
                new Transaction
                {
                    Name = "third",
                    Category = ExampleCategoryName,
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 101,
                    WalletId = Fixture.WalletCash.MoneyWalletId
                },
                new Transaction
                {
                    Name = "fourth",
                    Category = ExampleCategoryName,
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 102,
                    WalletId = Fixture.WalletBankAccount.MoneyWalletId
                }
            });
            //act
            var actionResult = await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            DbSet.Count().Should().Be(4);
            DbSet.Should().Contain(e => e.Name == "third");
            DbSet.Should().Contain(e => e.Name == "fourth");

            var result = ControllerTestHelpers.ValidateJsonResult<List<Transaction>>(actionResult);
            result.Should().NotBeNullOrEmpty();
            result.Should().OnlyContain(e => e.TransactionId > 0, "all element got an id");
        }

        [Fact(DisplayName = nameof(Updates_existing_Transactions))]
        public async Task Updates_existing_Transactions()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
            var transactions = new TransactionOperationBatch(new List<Transaction>
            {
                new Transaction
                {
                    TransactionId = _transaction1.TransactionId,
                    Name = "third",
                    Category = ExampleCategoryName,
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 101,
                    WalletId = Fixture.WalletCash.MoneyWalletId
                },
                new Transaction
                {
                    TransactionId = _transaction2.TransactionId,
                    Name = "fourth",
                    Category = ExampleCategoryName,
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16"),
                    Direction = MoneyDirection.Expense,
                    Value = 102,
                    WalletId = Fixture.WalletBankAccount.MoneyWalletId
                }
            });
            //act
            await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            DbSet.Count().Should().Be(2);
            DbSet.Should().Contain(e => e.Name == "third");
            DbSet.Should().Contain(e => e.Name == "fourth");
        }

        [Fact(DisplayName = nameof(Only_saves_date_not_time))]
        public async Task Only_saves_date_not_time()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
            var transactions = new TransactionOperationBatch(new List<Transaction>
            {
                new Transaction
                {
                    Name = "third",
                    Category = ExampleCategoryName,
                    Comment = "comment",
                    CreatedAt = DateTime.Parse("2017-09-16 13:12"),
                    Direction = MoneyDirection.Expense,
                    Value = 101,
                    WalletId = Fixture.WalletCash.MoneyWalletId
                }
            });
            //act
            var actionResult = await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            var result = ControllerTestHelpers.ValidateJsonResult<List<Transaction>>(actionResult);
            var dateTime = DateTime.Parse("2017-09-16 00:00");
            result[0].CreatedAt.Should().Be(dateTime, "it removes time part in the result");
            var entity = Fixture.DbContext.Transactions.Find(result[0].TransactionId);
            entity.CreatedAt.Should().Be(dateTime, "it removes time part in the database");
        }

        [Fact(DisplayName = nameof(Can_delete_transactions_by_id))]
        public async Task Can_delete_transactions_by_id()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
            var transactions = new TransactionOperationBatch(
                new List<long> { _transaction1.TransactionId });
            //act
            var actionResult = await controller.BatchSave(transactions, CancellationToken.None);

            //assert

            var result = ControllerTestHelpers.ValidateJsonResult<List<Transaction>>(actionResult);
            DbSet.Should().NotContain(e => e.TransactionId == _transaction1.TransactionId, "it is deleted");
        }

        [Fact(DisplayName = nameof(Returns_BadRequest_if_input_invalid))]
        public async Task Returns_BadRequest_if_input_invalid()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
            var transactions = new TransactionOperationBatch(
                TransactionBuilder.CreateListOfSize(1).BuildList().ToList());
            controller.ModelState.AddModelError("Name", "Invalid");
            //act
            var actionResult = await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            ControllerTestHelpers.ResultShouldBeBadRequest(actionResult);

        }

        [Fact(DisplayName = nameof(On_updating_transaction_updates_article_table))]
        public async Task On_updating_transaction_updates_article_table()
        {
            //arrange
            var newCategory = "cat2";
            var controller = Fixture.GetService<TransactionController>();
            DateTime newDate = DateTime.Parse("2017-10-17");
            var transactions = new TransactionOperationBatch(new List<Transaction>
            {
                new Transaction
                {
                    TransactionId = _transaction1.TransactionId,
                    Name = FirstArticleName,
                    Category = newCategory,
                    Comment = "comment",
                    CreatedAt = newDate,
                    Direction = MoneyDirection.Expense,
                    Value = 105,
                    WalletId = Fixture.WalletBankAccount.MoneyWalletId
                }
            });
            //act
            await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            var articles = Fixture.DbContext.Article.ToList();

            articles.Where(e => e.Name == FirstArticleName).Should().HaveCount(1);
            var articleEntity = articles.FirstOrDefault(e => e.Name == FirstArticleName);
            articleEntity.Should().NotBeNull();
            articleEntity.Category.Should().Be(newCategory);
            articleEntity.LastPrice.Should().Be(105);
            articleEntity.LastUpdate.Should().Be(newDate);
            articleEntity.LastWalletId.Should().Be(Fixture.WalletBankAccount.MoneyWalletId);
            articleEntity.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(On_new_transaction_with_unknown_article_updates_article_table))]
        public async Task On_new_transaction_with_unknown_article_updates_article_table()
        {
            //arrange
            var newCategory = "cat2";
            var controller = Fixture.GetService<TransactionController>();
            DateTime newDate = DateTime.Parse("2017-10-17");
            const string newArticleName = "third";
            var transactions = new TransactionOperationBatch(new List<Transaction>
            {
                new Transaction
                {
                    Name = newArticleName,
                    Category = newCategory,
                    Comment = "comment",
                    CreatedAt = newDate,
                    Direction = MoneyDirection.Expense,
                    Value = 105,
                    WalletId = Fixture.WalletBankAccount.MoneyWalletId
                }
            });
            //act
            await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            var articles = Fixture.DbContext.Article.ToList();

            articles.Where(e => e.Name == newArticleName).Should().HaveCount(1);
            var articleEntity = articles.FirstOrDefault(e => e.Name == newArticleName);
            articleEntity.Should().NotBeNull();
            articleEntity.Category.Should().Be(newCategory);
            articleEntity.LastPrice.Should().Be(105);
            articleEntity.LastUpdate.Should().Be(newDate);
            articleEntity.LastWalletId.Should().Be(Fixture.WalletBankAccount.MoneyWalletId);
            articleEntity.Occurence.Should().Be(1);
        }

        [Fact(DisplayName = nameof(On_new_transaction_with_known_article_updates_article_table))]
        public async Task On_new_transaction_with_known_article_updates_article_table()
        {
            //arrange
            var newCategory = "cat2";
            var controller = Fixture.GetService<TransactionController>();
            DateTime newDate = DateTime.Parse("2017-10-17");
            var transactions = new TransactionOperationBatch(new List<Transaction>
            {
                new Transaction
                {
                    Name = FirstArticleName,
                    Category = newCategory,
                    Comment = "comment",
                    CreatedAt = newDate,
                    Direction = MoneyDirection.Expense,
                    Value = 105,
                    WalletId = Fixture.WalletBankAccount.MoneyWalletId
                }
            });
            //act
            var actionResult = await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            var articles = Fixture.DbContext.Article.ToList();

            articles.Where(e => e.Name == FirstArticleName).Should().HaveCount(1);
            var articleEntity = articles.FirstOrDefault(e => e.Name == FirstArticleName);
            articleEntity.Should().NotBeNull();
            articleEntity.Category.Should().Be(newCategory);
            articleEntity.LastPrice.Should().Be(105);
            articleEntity.LastUpdate.Should().Be(newDate);
            articleEntity.LastWalletId.Should().Be(Fixture.WalletBankAccount.MoneyWalletId);
            articleEntity.Occurence.Should().Be(2);
        }

        [Fact(DisplayName = nameof(On_delete_transaction_in_article_occurence_reduced))]
        public async Task On_delete_transaction_in_article_occurence_reduced()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
            var articleName = _transaction1.Name;
            {
                // Prepare database.
                var transaction3 = new TransactionBuilder()
                .WithName(FirstArticleName)
                .Build();
                Fixture.DbContext.Transactions.Add(transaction3);
                _article1.Occurence = 2;
                Fixture.DbContext.SaveChanges();
            }
            var transactions = new TransactionOperationBatch(
                new List<long> { _transaction1.TransactionId });
            //act
            await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            var articles = Fixture.DbContext.Article.ToList();

            articles.Where(e => e.Name == FirstArticleName).Should().HaveCount(1);
            var articleEntity = articles.FirstOrDefault(e => e.Name == FirstArticleName);
            articleEntity.Should().NotBeNull();
            articleEntity.Occurence.Should().Be(1);
        }


        [Fact(DisplayName = nameof(On_delete_last_transaction_it_removes_article))]
        public async Task On_delete_last_transaction_it_removes_article()
        {
            //arrange
            var controller = Fixture.GetService<TransactionController>();
            var transactions = new TransactionOperationBatch(
                new List<long> { _transaction1.TransactionId });
            //act
            await controller.BatchSave(transactions, CancellationToken.None);

            //assert
            var articles = Fixture.DbContext.Article.ToList();

            articles.Where(e => e.Name == FirstArticleName).Should().HaveCount(1);
            var articleEntity = articles.FirstOrDefault(e => e.Name == FirstArticleName);
            articleEntity.Should().BeNull();
        }

        #endregion
    }
}