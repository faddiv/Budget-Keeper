using OnlineWallet.Web.TestHelpers;
using System;
using System.Threading.Tasks;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Commands
{
    [Trait(nameof(ArticleCommands), nameof(ArticleCommands.UpdateArticleStatuses))]
    [Collection("Database collection")]
    public class ArticleCommandsUpdateArticleStatusesTests : IDisposable
    {
        private readonly ServicesFixture _fixture;
        private readonly IArticleCommands _articleCommands;

        public ArticleCommandsUpdateArticleStatusesTests(DatabaseFixture fixture)
        {
            _fixture = fixture.CreateServiceFixture();
            _articleCommands = _fixture.GetService<IArticleCommands>();
        }

        public void Dispose()
        {
            _fixture.Dispose();
        }

        [Fact(DisplayName = nameof(Test1))]
        public async Task Test1()
        {
        }
    }
}
