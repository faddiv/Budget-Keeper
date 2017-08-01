using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.Migrations
{
    [DbContext(typeof(WalletDbContext))]
    partial class WalletDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Wallet.Web.DataLayer.MoneyOperation", b =>
                {
                    b.Property<long>("MoneyOperationId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Comment")
                        .HasMaxLength(2147483647);

                    b.Property<DateTime>("CreatedAt");

                    b.Property<int>("Direction");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<double>("Value");

                    b.Property<int>("WalletId");

                    b.HasKey("MoneyOperationId");

                    b.HasIndex("WalletId");

                    b.ToTable("MoneyOperations");
                });

            modelBuilder.Entity("Wallet.Web.DataLayer.Wallet", b =>
                {
                    b.Property<int>("MoneyWalletId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("MoneyWalletId");

                    b.ToTable("Wallets");
                });

            modelBuilder.Entity("Wallet.Web.DataLayer.MoneyOperation", b =>
                {
                    b.HasOne("Wallet.Web.DataLayer.Wallet", "Wallet")
                        .WithMany()
                        .HasForeignKey("WalletId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
