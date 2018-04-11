using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Modules.GeneralDataModule.Models;
using OnlineWallet.Web.Modules.GeneralDataModule.Queries;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    [Route("api/v1/[controller]")]
    public class ArticleController : Controller
    {
        #region Fields

        private readonly IArticleQueries _articleQueries;

        #endregion

        #region  Constructors

        public ArticleController(IArticleQueries articleQueries)
        {
            _articleQueries = articleQueries;
        }

        #endregion

        #region  Public Methods

        [HttpGet]
        public Task<List<ArticleModel>> GetBy(string search = "", int limit = 10,
            CancellationToken token = default(CancellationToken))
        {
            return _articleQueries.SearchByText(search, limit, token);
        }

        public async Task<IActionResult> SyncFromTransactions(List<string> articles = null)
        {
            return Ok();
        }

        #endregion
    }
}