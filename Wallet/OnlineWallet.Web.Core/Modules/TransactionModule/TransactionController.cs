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
using OnlineWallet.Web.Common.Queries;
using OnlineWallet.Web.DataLayer;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    public class TransactionController : CrudController<Transaction, long>
    {
        #region  Constructors

        public TransactionController(IWalletDbContext db) : base(db)
        {
            ConditionBuilder = new TransactionConditionBuilder();
        }

        #endregion

        #region Properties

        protected override ConditionVisitorBase<Transaction> ConditionBuilder { get; }

        protected override DbSet<Transaction> DbSet => Db.Transactions;

        #endregion

        #region  Public Methods

        [HttpGet("BalanceInfo")]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(BalanceInfo))]
        public async Task<BalanceInfo> BalanceInfo(int year, int month, CancellationToken token)
        {
            var transactions = await Db.Transactions
                .Where(e => e.CreatedAt.Year == year && e.CreatedAt.Month == month)
                .ToListAsync(token);
            int income = transactions.Where(e => e.Direction == MoneyDirection.Income).Sum(e => e.Value);
            var balanceInfo = new BalanceInfo
            {
                Income = income,
                Spent = transactions.Where(e => e.Direction == MoneyDirection.Expense).Sum(e => e.Value),
                ToSaving = (int) Math.Round(income * 0.25, MidpointRounding.AwayFromZero),
                Planned = transactions.Where(e => e.Direction == MoneyDirection.Plan).Sum(e => e.Value)
            };
            return balanceInfo;
        }

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
                return ValidationError();
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
                StatusCode = (int) HttpStatusCode.OK
            };
        }

        #endregion
    }
}