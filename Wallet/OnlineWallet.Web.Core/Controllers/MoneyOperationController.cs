using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Controllers.Abstractions;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Controllers
{
    public class MoneyOperationController : CrudController<MoneyOperation>
    {
        public MoneyOperationController(IWalletDbContext db) : base(db)
        {
        }

        protected override DbSet<MoneyOperation> DbSet => Db.MoneyOperations;
    }
}
