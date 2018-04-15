using Xunit;

namespace OnlineWallet.Web.TestHelpers
{
    [CollectionDefinition("Provide Test Service")]
    public class TestServiceProviderCollection : ICollectionFixture<TestServiceProviderFixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}