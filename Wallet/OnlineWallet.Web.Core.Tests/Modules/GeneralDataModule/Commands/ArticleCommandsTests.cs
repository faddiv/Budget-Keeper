using OnlineWallet.Web.TestHelpers;
using System;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Commands
{
    [Trait(nameof(ArticleController), nameof(ArticleController.GetBy))]
    [Collection("Database collection")]
    public class ArticleControllerGetByTests : IDisposable
    {
        private readonly DatabaseFixture _fixture;
        private readonly IArticleCommands _articleCommands;

        public ArticleControllerGetByTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
            _articleCommands = _fixture.GetService<IArticleCommands>();
        }

        public void Dispose()
        {
            _fixture.Dispose();
        }
    }
}
