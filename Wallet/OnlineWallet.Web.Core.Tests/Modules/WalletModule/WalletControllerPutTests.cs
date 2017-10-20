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
            var entity = Fixture.Clone(TestWallet);
            entity.Name = null;
            ControllerTestHelpers.AddModelErrorsFrom(entity, Controller);

            //Act
            var result = await Controller.Put(entity.MoneyWalletId, entity, CancellationToken.None);

            //Assert
            ControllerTestHelpers.ResultShouldBeBadRequest(result);
        }

        [Fact(DisplayName = "Post_saves_new_wallet_if_everything_is_ok")]
        public async Task Put_updates_wallet_if_everything_is_ok()
        {
            //Arrange
            var entity = Fixture.Clone(TestWallet);
            entity.Name = "Changed Wallet";
            ControllerTestHelpers.AddModelErrorsFrom(entity, Controller);

            //Act
            var result = await Controller.Put(entity.MoneyWalletId, entity, CancellationToken.None);

            //Assert
            ResultShouldBeOk(result, HttpStatusCode.OK);
            DbSet.Should().Contain(e => e.MoneyWalletId == TestWallet.MoneyWalletId && e.Name == "Changed Wallet");
        }
    }
}