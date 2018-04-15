using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    [Trait(nameof(WalletController), nameof(WalletController.Put))]
    public class WalletControllerPutTests : WalletControllerTests
    {
        [Fact(DisplayName = nameof(Returns_BadRequest_if_no_name_provided))]
        public async Task Returns_BadRequest_if_no_name_provided()
        {
            //Arrange
            var entity = Fixture.Clone(TestWallet);
            entity.Name = null;
            ControllerTestHelpers.AddModelErrorsFrom(entity, Controller);

            //Act
            var result = await Controller.Put(entity.MoneyWalletId, entity, CancellationToken.None);

            //Assert
            ControllerTestHelpers.ResultShouldBeBadRequest(result);
        }

        [Fact(DisplayName = nameof(Updates_wallet_if_everything_is_ok))]
        public async Task Updates_wallet_if_everything_is_ok()
        {
            //Arrange
            var entity = Fixture.Clone(TestWallet);
            entity.Name = "Changed Wallet";
            ControllerTestHelpers.AddModelErrorsFrom(entity, Controller);

            //Act
            var result = await Controller.Put(entity.MoneyWalletId, entity, CancellationToken.None);

            //Assert
            ResultShouldBeOk(result, HttpStatusCode.OK);
            Fixture.DbContext.Wallets.Should().Contain(e => e.MoneyWalletId == TestWallet.MoneyWalletId && e.Name == "Changed Wallet");
        }

        [Fact(DisplayName = nameof(Returns_NotFound_if_object_doesnt_exists))]
        public async Task Returns_NotFound_if_object_doesnt_exists()
        {
            //Act
            var result = await Controller.Put(TestWallet.MoneyWalletId + 100, new Wallet { Name = "st" }, CancellationToken.None);

            //Assert
            ResultShouldBeNotFound(result);

        }

    }
}