using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace OnlineWallet.Web.Common
{
    public static class WalletControllerExtensions
    {
        #region  Public Methods

        public static ContentResult ValidationError(this ControllerBase controller)
        {
            return new ContentResult
            {
                Content = controller.GetFirstError(),
                StatusCode = (int) HttpStatusCode.BadRequest
            };
        }

        #endregion

        #region  Nonpublic Methods

        private static string GetFirstError(this ControllerBase controller)
        {
            return controller.ModelState.Values.SelectMany(e => e.Errors).FirstOrDefault()?.ErrorMessage;
        }

        #endregion
    }
}