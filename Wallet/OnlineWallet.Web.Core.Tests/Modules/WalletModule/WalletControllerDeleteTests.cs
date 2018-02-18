using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using Xunit;

namespace OnlineWallet.Web.Modules.WalletModule
{
    [Trait(nameof(WalletController), nameof(WalletController.Delete))]
    public class WalletControllerDeleteTests : WalletControllerTests
    {
        public WalletControllerDeleteTests(DatabaseFixture fixture)
            : base(fixture)
        {

        }

        [Fact(DisplayName = nameof(Delete_deletes_line_if_possible))]
        public async Task Delete_deletes_line_if_possible()
        {
            //Act
            var result = await Controller.Delete(TestWallet.MoneyWalletId, CancellationToken.None);

            //Assert
            ResultShouldBeOk(result, HttpStatusCode.OK);
            DbSet.Should().NotContain(e => e.MoneyWalletId == TestWallet.MoneyWalletId);

        }

        [Fact(DisplayName = nameof(Delete_returns_NotFound_if_object_doesnt_exists))]
        public async Task Delete_returns_NotFound_if_object_doesnt_exists()
        {
            //Act
            var result = await Controller.Delete(TestWallet.MoneyWalletId + 100, CancellationToken.None);

            //Assert
            ResultShouldBeNotFound(result);

        }

        [Fact(DisplayName = nameof(Delete_returns_BadRequest_if_already_used))]
        public async Task Delete_returns_BadRequest_if_already_used()
        {
            //Arrange
            Fixture.DbContext.Add(new TransactionBuilder()
                .WithWallet(TestWallet).Build());
            Fixture.DbContext.SaveChanges();
            //Act
            var result = await Controller.Delete(TestWallet.MoneyWalletId, CancellationToken.None);

            //Assert
            ControllerTestHelpers.ResultShouldBeBadRequest(result);
        }

    }
}