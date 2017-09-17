using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace OnlineWallet.Web.DataLayer
{
    public interface IWalletDbContext
    {
        #region Properties

        DbSet<Transaction> Transactions { get; }
        DbSet<Wallet> Wallets { get; }

        #endregion

        #region  Public Methods

        int SaveChanges();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        void UpdateEntityValues(object dbEntity, object newEntity);

        #endregion
    }
}