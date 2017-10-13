using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Common;
using OnlineWallet.Web.Common.Queries;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.WalletModule
{
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