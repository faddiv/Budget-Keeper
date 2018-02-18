using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.WalletModule
{
    [Trait(nameof(WalletController), nameof(WalletController.GetAll))]
    public class WalletControllerGetAllTests : WalletControllerTests
    {
        public WalletControllerGetAllTests(DatabaseFixture fixture)
            : base(fixture)
        {

        }


        [Fact(DisplayName = nameof(Returns_all_wallets))]
        public async Task Returns_all_wallets()
        {
            var entity = new Wallet
            {
                Name = "Unique"
            };
            DbSet.Add(entity);
            await Fixture.DbContext.SaveChangesAsync();

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