using System.Net;
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
    }
}