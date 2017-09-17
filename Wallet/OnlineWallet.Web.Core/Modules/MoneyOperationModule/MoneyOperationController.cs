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

namespace OnlineWallet.Web.Modules.MoneyOperationModule
{
    [SwaggerResponse((int) HttpStatusCode.Created, typeof(MoneyOperation))]
    [SwaggerResponse((int) HttpStatusCode.OK, typeof(MoneyOperation))]
    public class MoneyOperationController : CrudController<MoneyOperation, long>
    {
        #region  Constructors

        public MoneyOperationController(IWalletDbContext db) : base(db)
        {
            ConditionBuilder = new MoneyOperationConditionBuilder();
        }

        #endregion

        #region Properties

        protected override ConditionVisitorBase<MoneyOperation> ConditionBuilder { get; }

        protected override DbSet<MoneyOperation> DbSet => Db.MoneyOperations;

        #endregion

        [HttpPost("batchSave")]
        [SwaggerResponse((int)HttpStatusCode.Created, typeof(List<MoneyOperation>))]
        [SwaggerResponse((int)HttpStatusCode.OK, typeof(List<MoneyOperation>))]
        public async Task<List<MoneyOperation>> BatchSave([FromBody, Required]List<MoneyOperation> operations, CancellationToken token)
        {
            var existingIds = operations.Where(e => e.MoneyOperationId > 0).Select(e => e.MoneyOperationId).ToList();
            var existingEntities = DbSet.Where(e => existingIds.Contains(e.MoneyOperationId)).ToList();
            foreach (var operation in operations)
            {
                operation.CreatedAt = operation.CreatedAt.Date;
                if (operation.MoneyOperationId != 0)
                {
                    var existingEntity = existingEntities.Find(e => e.MoneyOperationId == operation.MoneyOperationId);
                    if (existingEntity == null)
                    {
                        throw new Exception("Money operation doesn't exists");
                    }
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