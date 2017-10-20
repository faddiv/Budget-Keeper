using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.WalletModule
{
    [Trait("WalletController", "Post")]
    public class WalletControllerPostTests : WalletControllerTests
    {
        public WalletControllerPostTests(DatabaseFixture fixture) 
            : base(fixture)
        {
        }

        [Fact(DisplayName = "Post_returns_BadRequest_if_no_name_provided")]
        public async Task Post_returns_BadRequest_if_no_name_provided()
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


        [Fact(DisplayName = "Post_saves_new_wallet_if_everything_is_ok")]
        public async Task Post_saves_new_wallet_if_everything_is_ok()
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
            DbSet.Should().Contain(e => e.Name == "New Wallet");
        }

    }
}