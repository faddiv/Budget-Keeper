using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Common.Swagger;
using OnlineWallet.Web.DataLayer;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Common
{
    public static class WalletControllerExtensions
    {
        public static ContentResult ValidationError(this ControllerBase controller)
        {
            return new ContentResult
            {
                Content = controller.GetFirstError(),
                StatusCode = (int)HttpStatusCode.BadRequest
            };
        }

        private static string GetFirstError(this ControllerBase controller)
        {
            return controller.ModelState.Values.SelectMany(e => e.Errors).FirstOrDefault()?.ErrorMessage;
        }


    }
}