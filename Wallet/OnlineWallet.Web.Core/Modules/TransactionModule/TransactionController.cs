using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.Common;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule.Commands;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.Modules.TransactionModule.Queries;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Route("api/v1/[controller]")]
    public class TransactionController : Controller
    {
        #region Fields

        private readonly IBatchSaveCommand _batchSave;
        private readonly ITransactionQueries _queries;

        #endregion

        #region  Constructors

        public TransactionController(ITransactionQueries queries, IBatchSaveCommand batchSave)
        {
            _queries = queries;
            _batchSave = batchSave;
        }

        #endregion

        #region  Public Methods

        [HttpPost("BatchSave")]
        [SwaggerResponse((int) HttpStatusCode.Created, typeof(List<Transaction>))]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(List<Transaction>))]
        [SwaggerResponse((int) HttpStatusCode.BadRequest, typeof(object))]
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
            await _batchSave.Execute(model, token);
            return new JsonResult(model.Save)
            {
                StatusCode = (int) HttpStatusCode.OK
            };
        }

        [HttpGet(nameof(FetchByArticle))]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(List<Transaction>))]
        public Task<List<Transaction>> FetchByArticle(string article, int limit = 20, int skip = 0,
            CancellationToken token = default(CancellationToken))
        {
            return _queries.FetchByArticleAsync(article, limit, skip, token);
        }
        
        [HttpGet(nameof(FetchByDateRange))]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(List<Transaction>))]
        public Task<List<Transaction>> FetchByDateRange(DateTime start, DateTime end,
            CancellationToken token = default(CancellationToken))
        {
            return _queries.FetchByDateRange(start, end, token);
        }

        [HttpGet(nameof(FetchByCategory))]
        [SwaggerResponse((int)HttpStatusCode.OK, typeof(List<Transaction>))]
        public Task<List<Transaction>> FetchByCategory(string category, DateTime? start = null, DateTime? end = null,
            int? limit = null, int? skip = null, CancellationToken token = default(CancellationToken))
        {
            return _queries.FetchByCategory(category, start, end, limit, skip, token);
        }

        #endregion
    }
}