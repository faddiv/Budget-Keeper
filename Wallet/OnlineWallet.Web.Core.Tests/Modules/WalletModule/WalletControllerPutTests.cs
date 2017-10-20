using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.WalletModule
{
    [Trait("WalletController", "Put")]
    public class WalletControllerPutTests : WalletControllerTests
    {
        public WalletControllerPutTests(DatabaseFixture fixture)
            : base(fixture)
        {
        }

        [Fact(DisplayName = "Put_returns_BadRequest_if_no_name_provided")]
        public async Task Put_returns_BadRequest_if_no_name_provided()
        {
            //Arrange
            var wallet = new DataLayer.Wallet
            {
                MoneyWalletId = TestWallet.MoneyWalletId,
                Name = null
            };
            ControllerTestHelpers.AddModelErrorsFrom(wallet, Controller);

            //Act
            var result = await Controller.Put(wallet.MoneyWalletId, wallet, CancellationToken.None);

            //Assert
            ResultShouldBeBadRequest(result);
        }

        [Fact(DisplayName = "Post_saves_new_wallet_if_everything_is_ok")]
        public async Task Put_updates_wallet_if_everything_is_ok()
        {
            //Arrange
            var wallet = new DataLayer.Wallet
            {
                MoneyWalletId = TestWallet.MoneyWalletId,
                Name = "Changed Wallet"
            };
            ControllerTestHelpers.AddModelErrorsFrom(wallet, Controller);

            //Act
            var result = await Controller.Put(wallet.MoneyWalletId, wallet, CancellationToken.None);

            //Assert
            ResultShouldBeOk(result, HttpStatusCode.OK);
            Fixture.DbContext.Wallets.Should().Contain(e => e.MoneyWalletId == TestWallet.MoneyWalletId && e.Name == "Changed Wallet");
        }
    }
}