using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.Common;
using OnlineWallet.Web.DataLayer;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Route("api/v1/[controller]")]
    public class TransactionController : Controller
    {
        private readonly ITransactionQueries queries;
        private readonly IBatchSaveCommand batchSave;
        #region  Constructors

        public TransactionController(ITransactionQueries queries, IBatchSaveCommand batchSave)
        {
            this.queries = queries;
            this.batchSave = batchSave;
        }

        #endregion

        #region Properties
        
        #endregion

        #region  Public Methods
        [HttpGet(nameof(FetchByArticle))]
        [SwaggerResponse((int)HttpStatusCode.OK, typeof(List<Transaction>))]
        public Task<List<Transaction>> FetchByArticle(string article, int limit = 20,
            CancellationToken token = default(CancellationToken))
        {
            return queries.FetchByArticleAsync(article, limit, token);
        }


        [HttpGet(nameof(FetchByDateRange))]
        [SwaggerResponse((int)HttpStatusCode.OK, typeof(List<Transaction>))]
        public Task<List<Transaction>> FetchByDateRange(DateTime start, DateTime end,
            CancellationToken token = default(CancellationToken))
        {
            return queries.FetchByDateRange(start, end, token);
        }

        [HttpPost("BatchSave")]
        [SwaggerResponse((int)HttpStatusCode.Created, typeof(List<Transaction>))]
        [SwaggerResponse((int)HttpStatusCode.OK, typeof(List<Transaction>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, typeof(object))]
        public async Task<ActionResult> BatchSave(
            [FromBody, Required] TransactionOperationBatch model,
            CancellationToken token)
        {
            if (model == null || !ModelState.IsValid)
            {
                //Model can be null when there was a conversion exception in the incomming model.
                //for example TransactionId is int but the incomming data is null.
                return this.ValidationError();
            }
            model.Save = model.Save ?? new List<Transaction>();
            model.Delete = model.Delete ?? new List<long>();
            await batchSave.Execute(model, token);
            return new JsonResult(model.Save)
            {
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        #endregion

    }
}