using System.Net;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Controllers.Abstractions;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Models.Queries;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.MoneyOperationModule
{
    [SwaggerResponse((int)HttpStatusCode.Created, typeof(MoneyOperation))]
    [SwaggerResponse((int)HttpStatusCode.OK, typeof(MoneyOperation))]
    public class MoneyOperationController : CrudController<MoneyOperation, long>
    {
        public MoneyOperationController(IWalletDbContext db) : base(db)
        {
            ConditionBuilder = new MoneyOperationConditionBuilder();
        }

        protected override DbSet<MoneyOperation> DbSet => Db.MoneyOperations;
        protected override ConditionVisitorBase<MoneyOperation> ConditionBuilder { get; }
    }
}
