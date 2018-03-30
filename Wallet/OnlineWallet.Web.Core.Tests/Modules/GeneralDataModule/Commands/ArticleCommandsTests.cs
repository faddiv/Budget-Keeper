using OnlineWallet.Web.TestHelpers;
using System;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Commands
{
    //[Trait(nameof(ArticleCommands), nameof(ArticleCommands.))]
    [Collection("Database collection")]
    public class ArticleCommandsTests : IDisposable
    {
        private readonly ServicesFixture _fixture;
        private readonly IArticleCommands _articleCommands;

        public ArticleCommandsTests(DatabaseFixture fixture)
        {
            _fixture = fixture.CreateServiceFixture();
            _articleCommands = _fixture.GetService<IArticleCommands>();
        }

        public void Dispose()
        {
            _fixture.Dispose();
        }
    }
}
