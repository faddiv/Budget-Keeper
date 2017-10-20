﻿using System;
using System.Linq;
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
        public Wallet WalletCash { get; set; }
        public Wallet WalletBankAccount { get; set; }
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
        }
        public void Cleanup()
        {
            DbContext.RemoveRange(DbContext.Transactions);
            DbContext.RemoveRange(DbContext.Wallets.Skip(2));
            DbContext.SaveChanges();
        }
        public void Dispose()
        {
            DbContext.Dispose();
        }

        public TEntity Clone<TEntity>(TEntity original)
        {
            return AutoMapper.Mapper.Map<TEntity>(original);
        }
    }
}