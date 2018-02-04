using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers.Builders;
using TestStack.Dossier.Lists;

namespace OnlineWallet.Web.TestHelpers
{
    public class DatabaseFixture : IDisposable
    {
        public WalletDbContext DbContext { get; set; }
        public Wallet WalletCash { get; set; }
        public Wallet WalletBankAccount { get; set; }
        public IServiceScope Services { get; set; }
        public ServiceProvider RootServices { get; set; }

        internal T GetService<T>()
        {
            return (T)Services.ServiceProvider.GetRequiredService(typeof(T));
        }

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
            WalletCash = new Wallet { Name = MoneySource.Cash.ToString() };
            WalletBankAccount = new Wallet { Name = MoneySource.BankAccount.ToString() };
            DbContext.Wallets.AddRange(
                WalletCash,
                WalletBankAccount);
            DbContext.SaveChanges();
            AutoMapper.Mapper.Initialize(config =>
            {
                config.CreateMap(typeof(Transaction), typeof(Transaction));
                config.CreateMap(typeof(Wallet), typeof(Wallet));
            });
            var services = new ServiceCollection();
            services.AddSingleton<IWalletDbContext>(DbContext);
            Startup.AddWalletServices(services);
            foreach (var controller in typeof(Startup).Assembly.GetTypes().Where(e => typeof(ControllerBase).IsAssignableFrom(e)))
            {
                services.AddScoped(controller);
            }
            RootServices = services.BuildServiceProvider();
            Services = RootServices.CreateScope();
        }
        public void Cleanup()
        {
            DbContext.RemoveRange(DbContext.Transactions);
            DbContext.RemoveRange(DbContext.Wallets.Skip(2));
            DbContext.SaveChanges();
            Services.Dispose();
            Services = RootServices.CreateScope();
        }
        public void Dispose()
        {
            DbContext.Dispose();
            RootServices.Dispose();
        }

        public TEntity Clone<TEntity>(TEntity original)
        {
            return AutoMapper.Mapper.Map<TEntity>(original);
        }

        public void PrepareDataWith(Func<TransactionBuilder, TransactionBuilder> rules, int size = 100)
        {
            var transactions = rules(TransactionBuilder.CreateListOfSize(size)
                .All().WithName("Nothing").WithCategory(null))
                .BuildList();
            DbContext.Transactions.AddRange(transactions);
            DbContext.SaveChanges();
        }

    }
}