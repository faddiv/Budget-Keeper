using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.TestHelpers
{
    public class DatabaseFixture : IDisposable
    {
        public WalletDbContext DbContext { get; set; }
        public Wallet Wallet1 { get; set; }
        public Wallet Wallet2 { get; set; }
        public DatabaseFixture()
        {
            var optionsBuilder = new DbContextOptionsBuilder<WalletDbContext>();
            optionsBuilder.UseInMemoryDatabase("Wallet");
            optionsBuilder.EnableSensitiveDataLogging();
            optionsBuilder.UseLoggerFactory(new LoggerFactory(new[]
            {
                new ConsoleLoggerProvider(new ConsoleLoggerSettings
                {
                    IncludeScopes = true,
                })
            }));
            DbContext = new WalletDbContext(optionsBuilder.Options);
            Wallet1 = new Wallet { Name = MoneySource.Cash.ToString() };
            Wallet2 = new Wallet { Name = MoneySource.BankAccount.ToString() };
            DbContext.Wallets.AddRange(
                Wallet1,
                Wallet2);
            DbContext.SaveChanges();

        }

        public void Dispose()
        {
            DbContext.Dispose();
        }
    }
}