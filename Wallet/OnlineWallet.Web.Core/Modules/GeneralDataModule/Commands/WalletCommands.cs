using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.Common;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Commands
{
    public interface IWalletCommands
    {
        #region  Public Methods

        Task<DeleteResult> DeleteWalletById(int walletId, CancellationToken token);
        Task<int> InsertWallet(Wallet wallet, CancellationToken token);
        Task<UpdateResult> UpdateWallet(Wallet wallet, CancellationToken token);

        #endregion
    }

    public class WalletCommands : IWalletCommands
    {
        #region  Constructors

        public WalletCommands(IWalletDbContext db)
        {
            Db = db;
        }

        #endregion

        #region Properties

        public IWalletDbContext Db { get; }

        #endregion

        #region  Public Methods

        public async Task<DeleteResult> DeleteWalletById(int walletId, CancellationToken token)
        {
            var entity = await Db.Wallets.FindAsync(new object[] {walletId}, token);
            if (entity == null)
            {
                return DeleteResult.NotFound;
            }

            if (await Db.Transactions.AnyAsync(e => e.Wallet == entity, token))
            {
                return DeleteResult.HasDependency;
            }

            Db.Wallets.Remove(entity);
            await Db.SaveChangesAsync(token);
            return DeleteResult.Success;
        }

        public Task<int> InsertWallet(Wallet wallet, CancellationToken token)
        {
            Db.Wallets.Add(wallet);
            return Db.SaveChangesAsync(token);
        }

        public async Task<UpdateResult> UpdateWallet(Wallet wallet, CancellationToken token)
        {
            var entity = await Db.Wallets.FindAsync(new object[] {wallet.MoneyWalletId}, token);
            if (entity == null)
            {
                return UpdateResult.NotFound;
            }

            Db.UpdateEntityValues(entity, wallet);
            await Db.SaveChangesAsync(token);
            return UpdateResult.Success;
        }

        #endregion
    }
}