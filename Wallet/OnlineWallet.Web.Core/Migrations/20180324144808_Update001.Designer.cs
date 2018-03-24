﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using System;

namespace OnlineWallet.Web.Migrations
{
    [DbContext(typeof(WalletDbContext))]
    [Migration("20180324144808_Update001")]
    partial class Update001
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.0-rtm-26452")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("OnlineWallet.Web.DataLayer.Article", b =>
                {
                    b.Property<string>("Name")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(200);

                    b.Property<string>("Category")
                        .HasMaxLength(200);

                    b.Property<int>("LastPrice");

                    b.Property<DateTime>("LastUpdate");

                    b.Property<int>("LastWalletId");

                    b.Property<int>("Occurence");

                    b.HasKey("Name");

                    b.HasIndex("LastWalletId");

                    b.ToTable("Article");
                });

            modelBuilder.Entity("OnlineWallet.Web.DataLayer.Transaction", b =>
                {
                    b.Property<long>("TransactionId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Category")
                        .HasMaxLength(200);

                    b.Property<string>("Comment")
                        .HasMaxLength(2147483647);

                    b.Property<DateTime>("CreatedAt");

                    b.Property<short>("Direction");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.Property<int>("Value");

                    b.Property<int>("WalletId");

                    b.HasKey("TransactionId");

                    b.HasIndex("WalletId");

                    b.ToTable("Transactions");
                });

            modelBuilder.Entity("OnlineWallet.Web.DataLayer.Wallet", b =>
                {
                    b.Property<int>("MoneyWalletId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200);

                    b.HasKey("MoneyWalletId");

                    b.ToTable("Wallets");
                });

            modelBuilder.Entity("OnlineWallet.Web.DataLayer.Article", b =>
                {
                    b.HasOne("OnlineWallet.Web.DataLayer.Wallet", "LastWallet")
                        .WithMany()
                        .HasForeignKey("LastWalletId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OnlineWallet.Web.DataLayer.Transaction", b =>
                {
                    b.HasOne("OnlineWallet.Web.DataLayer.Wallet", "Wallet")
                        .WithMany()
                        .HasForeignKey("WalletId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
