using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Modules.CategoryModule.Models;
using OnlineWallet.Web.Modules.CategoryModule.Services;

namespace OnlineWallet.Web.Modules.CategoryModule
{
    [Route("api/v1/[controller]")]
    public class CategoryController : Controller
    {
        #region Fields

        private readonly ICategoryQueries _categoryQueries;

        #endregion

        #region  Constructors

        public CategoryController(ICategoryQueries categoryQueries)
        {
            _categoryQueries = categoryQueries;
        }

        #endregion

        #region  Public Methods

        [HttpGet]
        public Task<List<CategoryModel>> GetBy(string search = "", int limit = 10,
            CancellationToken token = default(CancellationToken))
        {
            return _categoryQueries.GetBySearchText(search, limit, token);
        }

        #endregion
    }
}