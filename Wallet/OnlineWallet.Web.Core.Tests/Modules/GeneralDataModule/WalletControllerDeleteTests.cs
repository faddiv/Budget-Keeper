using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    [Trait(nameof(WalletController), nameof(WalletController.Delete))]
    public class WalletControllerDeleteTests : WalletControllerTests
    {
        [Fact(DisplayName = nameof(Deletes_line_if_possible))]
        public async Task Deletes_line_if_possible()
        {
            //Act
            var result = await Controller.Delete(TestWallet.MoneyWalletId, CancellationToken.None);

            //Assert
            ResultShouldBeOk(result, HttpStatusCode.OK);
            Fixture.DbContext.Wallets.Should().NotContain(e => e.MoneyWalletId == TestWallet.MoneyWalletId);

        }

        [Fact(DisplayName = nameof(Returns_NotFound_if_object_doesnt_exists))]
        public async Task Returns_NotFound_if_object_doesnt_exists()
        {
            //Act
            var result = await Controller.Delete(TestWallet.MoneyWalletId + 100, CancellationToken.None);

            //Assert
            ResultShouldBeNotFound(result);

        }

        [Fact(DisplayName = nameof(Returns_BadRequest_if_already_used))]
        public async Task Returns_BadRequest_if_already_used()
        {
            //Arrange
            Fixture.DbContext.Transactions.Add(new TransactionBuilder()
                .WithWallet(TestWallet).Build());
            Fixture.DbContext.SaveChanges();
            //Act
            var result = await Controller.Delete(TestWallet.MoneyWalletId, CancellationToken.None);

            //Assert
            ControllerTestHelpers.ResultShouldBeBadRequest(result);
        }

    }
}