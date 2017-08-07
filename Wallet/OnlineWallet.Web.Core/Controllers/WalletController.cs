using System.Net;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Controllers.Abstractions;
using OnlineWallet.Web.DataLayer;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace OnlineWallet.Web.Controllers
{
    [SwaggerResponse((int)HttpStatusCode.Created, typeof(Wallet))]
    [SwaggerResponse((int)HttpStatusCode.OK, typeof(Wallet))]
    public class WalletController : CrudController<Wallet, int>
    {
        public WalletController(IWalletDbContext db) : base(db)
        {
        }

        protected override DbSet<Wallet> DbSet => Db.Wallets;
    }
}