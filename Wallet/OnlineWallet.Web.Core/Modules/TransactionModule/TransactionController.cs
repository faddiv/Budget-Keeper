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
        #region  Constructors

        public TransactionController(IWalletDbContext db)
        {
            Db = db;
        }

        #endregion

        #region Properties

        public IWalletDbContext Db { get; }

        protected DbSet<Transaction> DbSet => Db.Transactions;

        #endregion

        #region  Public Methods
        [HttpGet(nameof(FetchByArticle))]
        [SwaggerResponse((int)HttpStatusCode.OK, typeof(List<Transaction>))]
        public async Task<List<Transaction>> FetchByArticle(string article, int limit = 20,
            CancellationToken token = default(CancellationToken))
        {
            return await Db.Transactions
                   .Where(e => e.Name == article)
                   .OrderByDescending(e => e.CreatedAt)
                   .ThenBy(e => e.Name)
                   .ThenByDescending(e => e.TransactionId)
                   .Take(limit)
                   .ToListAsync(token);
        }


        [HttpGet(nameof(FetchByDateRange))]
        [SwaggerResponse((int)HttpStatusCode.OK, typeof(List<Transaction>))]
        public async Task<List<Transaction>> FetchByDateRange(DateTime start, DateTime end,
            CancellationToken token = default(CancellationToken))
        {
            return await Db.Transactions
                   .Where(e => start <= e.CreatedAt && e.CreatedAt <= end)
                   .OrderByDescending(e => e.CreatedAt)
                   .ThenBy(e => e.Name)
                   .ThenByDescending(e => e.TransactionId)
                   .ToListAsync(token);
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
            var existingIds = model.Save.Where(e => e.TransactionId > 0).Select(e => e.TransactionId).ToList();
            existingIds.AddRange(model.Delete);
            var existingEntities = DbSet.Where(e => existingIds.Contains(e.TransactionId)).ToList();
            foreach (var operation in model.Save)
            {
                operation.CreatedAt = operation.CreatedAt.Date;
                if (operation.TransactionId != 0)
                {
                    var existingEntity = existingEntities.Find(e => e.TransactionId == operation.TransactionId);
                    if (existingEntity == null)
                    {
                        throw new Exception("Money operation doesn't exists");
                    }
                    //Too slow. Need to be replaced with a custom solution. (And should make multi threaded)
                    Db.UpdateEntityValues(existingEntity, operation);
                }
                else
                {
                    await DbSet.AddAsync(operation, token);
                    token.ThrowIfCancellationRequested();
                }
            }
            foreach (var id in model.Delete)
            {
                var existingEntity = existingEntities.Find(e => e.TransactionId == id);
                if (existingEntity != null)
                {
                    Db.Transactions.Remove(existingEntity);
                }
            }
            await Db.SaveChangesAsync(token);
            return new JsonResult(model.Save)
            {
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        #endregion

    }
}