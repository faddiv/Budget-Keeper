using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace OnlineWallet.Web.DataLayer
{
    public class WalletDbContext : DbContext, IWalletDbContext
    {
        public WalletDbContext(DbContextOptions<WalletDbContext> options)
            : base(options)
        {
            
        }
        public DbSet<MoneyOperation> MoneyOperations => Set<MoneyOperation>();

        public DbSet<Wallet> Wallets => Set<Wallet>();

        public void UpdateEntityValues(object dbEntity, object newEntity)
        {
            var properties = Entry(dbEntity).Properties;
            var newEntry = Entry(newEntity);
            foreach (var property in properties)
            {
                if (property.Metadata.IsPrimaryKey() ||
                    property.Metadata.IsShadowProperty)
                {
                    continue;
                }
                property.CurrentValue = newEntry.Property(property.Metadata.Name).OriginalValue;
            }
        }
    }
}
