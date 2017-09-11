﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OnlineWallet.Web.DataLayer
{
    public class WalletDesignTimeDbContextFactory : IDesignTimeDbContextFactory<WalletDbContext>
    {
        public WalletDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<WalletDbContext>();
            optionsBuilder.UseSqlServer("Server=.\\sqlexpress;Database=Wallet;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new WalletDbContext(optionsBuilder.Options);
        }
    }
}