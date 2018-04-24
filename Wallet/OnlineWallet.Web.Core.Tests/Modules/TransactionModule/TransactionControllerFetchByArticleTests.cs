using System.Threading.Tasks;
using FluentAssertions;
using TestStack.Dossier.Lists;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait(nameof(TransactionController), nameof(TransactionController.FetchByArticle))]
    public class TransactionControllerFetchByArticleTests : TransactionControllerTests
    {
        [Fact(DisplayName = nameof(Fetch_is_case_insensitive))]
        public async Task Fetch_is_case_insensitive()
        {
            // Arrange
            await Fixture.PrepareDataWith(rules => rules
                .TheFirst(1).WithName("SECOND")
                .TheNext(1).WithName("second"));

            // Act
            var result = await Controller.FetchByArticle("Second");

            // Assert
            result.Should().NotBeNullOrEmpty();
            result.Should().HaveCount(2);
        }

        [Fact(DisplayName =nameof(Fetches_latest_first))]
        public async Task Fetches_latest_first()
        {
            // Arrange
            await Fixture.PrepareDataWith(rules => rules
                    .All().WithName("second")
                    .TheFirst(50).WithCreatedAt(2017,9)
                    .TheNext(50).WithCreatedAt(2017,10));

            // Act
            var result = await Controller.FetchByArticle("second");
            
            result.Should().BeInDescendingOrder(e => e.CreatedAt);
        }
    }
}