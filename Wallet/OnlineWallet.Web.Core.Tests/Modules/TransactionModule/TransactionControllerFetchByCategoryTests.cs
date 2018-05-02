using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using TestStack.Dossier.Lists;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait(nameof(TransactionController), nameof(TransactionController.FetchByCategory))]
    public class TransactionControllerFetchByCategoryTests : TransactionControllerTests
    {
        [Fact(DisplayName = nameof(Can_filter_by_category))]
        public async Task Can_filter_by_category()
        {
            // Arrange
            await Fixture.PrepareDataWith(rules => rules
                .All().WithCreatedAt(2017, 10).WithCategoryRandom()
                .TheFirst(33).WithCategory("cat"));

            // Act
            var result = await Controller.FetchByCategory("cat");

            // Assert
            result.Should().NotBeEmpty();
            result.Should().OnlyContain(e => e.Category == "cat");
        }

        [Fact(DisplayName = nameof(Can_filter_by_start_date))]
        public async Task Can_filter_by_start_date()
        {
            // Arrange
            await PrepareData();

            // Act
            var result = await Controller.FetchByCategory(
                "cat",
                DateTime.Parse("2017-10-01"));

            // Assert
            result.Should().NotBeEmpty();
            result.Should().OnlyContain(e => e.CreatedAt.GreaterOrEqualTo("2017-09-01"));
        }

        [Fact(DisplayName = nameof(Can_filter_by_end_date))]
        public async Task Can_filter_by_end_date()
        {
            // Arrange
            await PrepareData();

            // Act
            var result = await Controller.FetchByCategory(
                "cat",
                end: DateTime.Parse("2017-10-31"));

            // Assert
            result.Should().NotBeEmpty();
            result.Should().OnlyContain(e => e.CreatedAt.LessOrEqualTo("2017-10-31"));
        }

        [Fact(DisplayName = nameof(Can_page_result))]
        public async Task Can_page_result()
        {
            // Arrange
            await PrepareData();

            // Act
            var result1 = await Controller.FetchByCategory(
                "cat",
                limit: 10, skip: 0);
            var result2 = await Controller.FetchByCategory(
                "cat",
                limit: 10, skip: 10);
            var result3 = await Controller.FetchByCategory(
                "cat",
                limit: 20, skip: 0);

            // Assert
            result1.Should().HaveCount(10, "10 element asked");
            result2.Should().HaveCount(10, "10 element asked");
            result3.Should().HaveCount(20, "20 element asked");
            result3.ShouldAllBeEquivalentTo(result1.Concat(result2), "elements of result3 is result1 following result2");
        }

        [Fact(DisplayName = nameof(Fetches_latest_first))]
        public async Task Fetches_latest_first()
        {
            // Arrange
            await PrepareData();

            // Act
            var result = await Controller.FetchByCategory("cat");

            // Assert
            result.Should().NotBeEmpty();
            result.Should().BeInDescendingOrder(e => e.CreatedAt);
        }

        private async Task PrepareData()
        {
            await Fixture.PrepareDataWith(rules => rules
                            .All().WithCategory("cat")
                            .TheFirst(33).WithCreatedAt(2017, 9)
                            .TheNext(33).WithCreatedAt(2017, 10)
                            .TheNext(34).WithCreatedAt(2017, 11));
        }
    }
}