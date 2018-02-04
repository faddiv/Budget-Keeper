using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OnlineWallet.Web.DataLayer
{
    public class WalletDesignTimeDbContextFactory : IDesignTimeDbContextFactory<WalletDbContext>
    {
        #region  Public Methods

        public WalletDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<WalletDbContext>();
            optionsBuilder.UseSqlServer(
                "Server=.\\sqlexpress;Database=WalletTest;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new WalletDbContext(optionsBuilder.Options);
        }

        #endregion
    }
}