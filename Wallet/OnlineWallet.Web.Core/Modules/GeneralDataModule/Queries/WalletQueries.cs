using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Queries
{
    public interface IWalletQueries
    {
        #region  Public Methods

        Task<List<Wallet>> GetAll(CancellationToken token);

        #endregion
    }

    public class WalletQueries : IWalletQueries
    {
        #region  Constructors

        public WalletQueries(IWalletDbContext db)
        {
            Db = db;
        }

        #endregion

        #region Properties

        public IWalletDbContext Db { get; }

        #endregion

        #region  Public Methods

        public Task<List<Wallet>> GetAll(CancellationToken token)
        {
            return Db.Wallets.ToListAsync(token);
        }

        #endregion
    }
}