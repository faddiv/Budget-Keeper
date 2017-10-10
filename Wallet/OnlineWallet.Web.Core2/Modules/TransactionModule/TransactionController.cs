using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Controllers.Abstractions;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Models.Queries;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [SwaggerResponse((int) HttpStatusCode.Created, typeof(Transaction))]
    [SwaggerResponse((int) HttpStatusCode.OK, typeof(Transaction))]
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

        [HttpPost("batchSave")]
        [SwaggerResponse((int)HttpStatusCode.Created, typeof(List<Transaction>))]
        [SwaggerResponse((int)HttpStatusCode.OK, typeof(List<Transaction>))]
        public async Task<List<Transaction>> BatchSave([FromBody, Required]List<Transaction> operations, CancellationToken token)
        {
            var existingIds = operations.Where(e => e.TransactionId > 0).Select(e => e.TransactionId).ToList();
            var existingEntities = DbSet.Where(e => existingIds.Contains(e.TransactionId)).ToList();
            foreach (var operation in operations)
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
                } else {
                    await DbSet.AddAsync(operation, token);
                    token.ThrowIfCancellationRequested();
                }
            }
            await Db.SaveChangesAsync(token);
            return operations;
        }
    }
}