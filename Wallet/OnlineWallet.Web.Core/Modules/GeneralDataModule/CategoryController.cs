using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Modules.GeneralDataModule.Models;
using OnlineWallet.Web.Modules.GeneralDataModule.Queries;

namespace OnlineWallet.Web.Modules.GeneralDataModule
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
