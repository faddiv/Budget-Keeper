using TestStack.Dossier;

namespace OnlineWallet.Web.TestHelpers
{
    public static class WalletEquivalence
    {
        public static string Category(this AnonymousValueFixture fixture)
        {
            return fixture.Words(nameof(Category)).Next();
        }
    }
}
