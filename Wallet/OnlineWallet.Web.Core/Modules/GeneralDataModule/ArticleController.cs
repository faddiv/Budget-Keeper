using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Modules.GeneralDataModule.Commands;
using OnlineWallet.Web.Modules.GeneralDataModule.Models;
using OnlineWallet.Web.Modules.GeneralDataModule.Queries;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    [Route("api/v1/[controller]")]
    public class ArticleController : Controller
    {
        #region Fields

        private readonly IArticleQueries _articleQueries;
        private readonly IArticleCommands _articleCommands;

        #endregion

        #region  Constructors

        public ArticleController(IArticleQueries articleQueries, IArticleCommands articleCommands)
        {
            _articleQueries = articleQueries;
            _articleCommands = articleCommands;
        }

        #endregion

        #region  Public Methods

        [HttpGet]
        public Task<List<ArticleModel>> GetBy(string search = "", int limit = 10,
            CancellationToken token = default(CancellationToken))
        {
            return _articleQueries.SearchByText(search, limit, token);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SyncFromTransactions(List<string> articles = null,
            CancellationToken token = default(CancellationToken))
        {
            await _articleCommands.UpdateArticleStatuses(articles, token);
            return Ok();
        }

        #endregion
    }
}