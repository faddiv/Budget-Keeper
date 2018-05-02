using System;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using TestStack.Dossier.Lists;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait(nameof(TransactionController), nameof(TransactionController.FetchByDateRange))]
    public class TransactionControllerFetchByDateRangeTests : TransactionControllerTests
    {
        [Fact(DisplayName = nameof(Only_Fetches_in_date_range))]
        public async Task Only_Fetches_in_date_range()
        {
            // Arrange
            await Fixture.PrepareDataWith(rules => rules
                .TheFirst(33).WithCreatedAt(2017, 9)
                .TheNext(33).WithCreatedAt(2017, 10)
                .TheNext(34).WithCreatedAt(2017, 11));

            // Act
            var result = await Controller.FetchByDateRange(
                DateTime.Parse("2017-10-01"),
                DateTime.Parse("2017-10-31"));

            // Assert
            result.Should().NotBeNullOrEmpty();
            result.Should().OnlyContain(e => e.CreatedAt.Month == 10);
        }

        [Fact(DisplayName = nameof(Only_Fetches_in_date_range))]
        public async Task Fetches_date_range_inclusive()
        {
            // Arrange
            await Fixture.PrepareDataWith(rules => rules
                .TheFirst(1).WithCreatedAt("2017-09-16")
                .TheNext(1).WithCreatedAt("2017-10-16"));

            // Act
            var result = await Controller.FetchByDateRange(
                DateTime.Parse("2017-09-16"),
                DateTime.Parse("2017-10-16"));

            // Assert
            result.Should().NotBeEmpty();
            result.Should().Contain(e => e.CreatedAt.EqualTo("2017-09-16"));
            result.Should().Contain(e => e.CreatedAt.EqualTo("2017-10-16"));
        }

        [Fact(DisplayName = nameof(Fetches_latest_first))]
        public async Task Fetches_latest_first()
        {
            // Arrange
            await Fixture.PrepareDataWith(rules => rules
                .TheFirst(33).WithCreatedAt(2017, 9)
                .TheNext(33).WithCreatedAt(2017, 10)
                .TheNext(34).WithCreatedAt(2017, 11));

            // Act
            var result = await Controller.FetchByDateRange(
                DateTime.Parse("2017-09-01"),
                DateTime.Parse("2017-11-30"));

            // Assert
            result.Should().NotBeEmpty();
            result.Should().BeInDescendingOrder(e => e.CreatedAt);
        }
    }
}