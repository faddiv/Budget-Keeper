using OnlineWallet.Web.Common;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    public class WalletControllerTests : CrudControllerTests<Wallet>
    {
        protected WalletController Controller { get; }
        protected Wallet TestWallet { get; }

        public WalletControllerTests(TestServiceProviderFixture fixture)
            : base(fixture)
        {
            Controller = Fixture.GetService<WalletController>();
            TestWallet = new Wallet
            {
                Name = "Test"
            };
            Fixture.DbContext.Wallets.Add(TestWallet);
            Fixture.DbContext.SaveChanges();
        }
    }
}