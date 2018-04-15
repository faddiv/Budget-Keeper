using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    [Trait(nameof(WalletController), nameof(WalletController.Post))]
    public class WalletControllerPostTests : WalletControllerTests
    {
        [Fact(DisplayName = nameof(Returns_BadRequest_if_no_name_provided))]
        public async Task Returns_BadRequest_if_no_name_provided()
        {
            //Arrange
            var entity = new DataLayer.Wallet
            {
                Name = null
            };
            ControllerTestHelpers.AddModelErrorsFrom(entity, Controller);

            //Act
            var result = await Controller.Post(entity, CancellationToken.None);

            //Assert
            ControllerTestHelpers.ResultShouldBeBadRequest(result);
        }


        [Fact(DisplayName = nameof(Saves_new_wallet_if_everything_is_ok))]
        public async Task Saves_new_wallet_if_everything_is_ok()
        {
            //Arrange
            var entity = new DataLayer.Wallet
            {
                Name = "New Wallet"
            };
            ControllerTestHelpers.AddModelErrorsFrom(entity, Controller);

            //Act
            var result = await Controller.Post(entity, CancellationToken.None);

            //Assert
            ResultShouldBeOk(result, HttpStatusCode.Created);
            Fixture.DbContext.Wallets.Should().Contain(e => e.Name == "New Wallet");
        }

    }
}