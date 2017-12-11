using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OnlineWallet.Web.DataLayer
{
    public class WalletDesignTimeDbContextFactory : IDesignTimeDbContextFactory<WalletDbContext>
    {
        public WalletDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<WalletDbContext>();
            //optionsBuilder.UseSqlServer("Server=.\\sqlexpress;Database=WalletTest;Trusted_Connection=True;MultipleActiveResultSets=true");
            optionsBuilder.UseSqlite("Data Source=d:\\WalletTest.sqlitedb");
            return new WalletDbContext(optionsBuilder.Options);
        }
    }
}