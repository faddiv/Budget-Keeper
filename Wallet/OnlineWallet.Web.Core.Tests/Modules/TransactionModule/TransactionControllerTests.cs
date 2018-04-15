using OnlineWallet.Web.TestHelpers;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    public class TransactionControllerTests : ServiceTestBase
    {
        protected TransactionController Controller { get; }

        public TransactionControllerTests()
        {
            Controller = Fixture.GetService<TransactionController>();
        }
    }
}