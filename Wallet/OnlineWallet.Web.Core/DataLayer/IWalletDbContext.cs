using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace OnlineWallet.Web.DataLayer
{
    public interface IWalletDbContext
    {
        #region Properties

        DbSet<Article> Article { get; }

        DbSet<Transaction> Transactions { get; }

        DbSet<Wallet> Wallets { get; }

        #endregion

        #region  Public Methods

        int SaveChanges();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);

        /// <summary>
        /// If setted to true, then sets QueryTrackingBehavior to NoTracking.
        /// </summary>
        void SetReadonly(bool isReadonly);

        void UpdateEntityValues(object dbEntity, object newEntity);

        #endregion
    }
}