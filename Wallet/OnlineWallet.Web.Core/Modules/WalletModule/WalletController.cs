using System.Net;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Controllers.Abstractions;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Models.Queries;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Modules.WalletModule
{
    [SwaggerResponse((int) HttpStatusCode.Created, typeof(Wallet))]
    [SwaggerResponse((int) HttpStatusCode.OK, typeof(Wallet))]
    public class WalletController : CrudController<Wallet, int>
    {
        #region  Constructors

        public WalletController(IWalletDbContext db) : base(db)
        {
            ConditionBuilder = new WalletConditionBuilder();
        }

        #endregion

        #region Properties

        protected override ConditionVisitorBase<Wallet> ConditionBuilder { get; }

        protected override DbSet<Wallet> DbSet => Db.Wallets;

        #endregion
    }
}