using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.DataLayer;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    [Trait(nameof(WalletController), nameof(WalletController.GetAll))]
    public class WalletControllerGetAllTests : WalletControllerTests
    {
        [Fact(DisplayName = nameof(Returns_all_wallets))]
        public async Task Returns_all_wallets()
        {
            var entity = new Wallet
            {
                Name = "Unique"
            };
            Fixture.DbContext.Wallets.Add(entity);
            await Fixture.DbContext.SaveChangesAsync(CancellationToken.None);

            //Act
            var result = await Controller.GetAll();

            //Assert
            result.Should().NotBeNullOrEmpty();
            result.Should().Contain(Fixture.WalletBankAccount);
            result.Should().Contain(Fixture.WalletCash);
            result.Should().Contain(entity);

        }
    }
}