using OnlineWallet.Web.Common;
using OnlineWallet.Web.TestHelpers;

namespace OnlineWallet.Web.Modules.WalletModule
{
    public class WalletControllerTests : CrudControllerTests
    {
        protected WalletController Controller { get; }
        protected DataLayer.Wallet TestWallet { get; }

        public WalletControllerTests(DatabaseFixture fixture)
            : base(fixture)
        {
            Controller = new WalletController(Fixture.DbContext);
            TestWallet = new DataLayer.Wallet
            {
                Name = "Test"
            };
            fixture.DbContext.Add(TestWallet);
            fixture.DbContext.SaveChanges();
        }
    }
}