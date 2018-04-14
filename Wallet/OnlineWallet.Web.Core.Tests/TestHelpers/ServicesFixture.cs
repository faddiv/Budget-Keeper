using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.TestHelpers.Builders;
using TestStack.Dossier.Lists;

namespace OnlineWallet.Web.TestHelpers
{
    public class ServicesFixture : IDisposable
    {
        #region Fields

        private readonly SqliteConnection _connection;
        private readonly IServiceProvider _rootServices;
        private IServiceScope _services;
        private IWalletDbContext _dbContext;
        private Wallet _walletBankAccount;
        private Wallet _walletCash;

        public IWalletDbContext DbContext
        {
            get
            {
                EnsureInitialized();
                return _dbContext;
            }
        }

        private void EnsureInitialized()
        {
            if (_dbContext != null)
                return;
            _dbContext = GetService<IWalletDbContext>();
        }

        public Wallet WalletBankAccount
        {
            get
            {
                EnsureInitialized();
                return _walletBankAccount;
            }
        }

        public Wallet WalletCash
        {
            get
            {
                EnsureInitialized();
                return _walletCash;
            }
        }

        #endregion

        #region  Constructors

        public ServicesFixture(DatabaseFixture fixture, Action<ServiceCollection> setup = null)
        {
            _connection = new SqliteConnection("DataSource=:memory:");

            var services = new ServiceCollection();
            Startup.AddWalletServices(services);
            AddControllers(services);

            CreateDatabase(services);
            setup?.Invoke(services);
            var containerBuilder = new Autofac.ContainerBuilder();
            containerBuilder.Populate(services);
            var container = containerBuilder.Build();
            _rootServices = new AutofacServiceProvider(container);
        }

        private void CreateDatabase(ServiceCollection services)
        {
            var optionsBuilder = new DbContextOptionsBuilder<WalletDbContext>();
            optionsBuilder.UseSqlite(_connection);
            optionsBuilder.EnableSensitiveDataLogging();
            optionsBuilder.UseLoggerFactory(new LoggerFactory(new[]
            {
                new ConsoleLoggerProvider(new ConsoleLoggerSettings
                {
                    IncludeScopes = true
                })
            }));
            services.AddScoped<IWalletDbContext>(provider =>
            {
                _connection.Open();
                var dbContext = new WalletDbContext(optionsBuilder.Options);
                dbContext.Database.EnsureCreated();

                _walletCash = new Wallet { Name = MoneySource.Cash.ToString() };
                _walletBankAccount = new Wallet { Name = MoneySource.BankAccount.ToString() };
                dbContext.Wallets.AddRange(
                    _walletCash,
                    _walletBankAccount);
                dbContext.SaveChanges();
                return dbContext;
            });
        }

        private static void AddControllers(ServiceCollection services)
        {
            foreach (var controller in typeof(Startup).Assembly.GetTypes()
                            .Where(e => typeof(ControllerBase).IsAssignableFrom(e)))
            {
                services.AddScoped(controller);
            }
        }

        #endregion

        #region  Public Methods

        public void Cleanup()
        {
            Dispose();
        }

        public void Dispose()
        {
            _services.Dispose();
            _services = null;
            _dbContext = null;
            _connection.Close();
        }

        public TEntity Clone<TEntity>(TEntity original)
        {
            return AutoMapper.Mapper.Map<TEntity>(original);
        }

        public Task PrepareDataWith(Func<TransactionBuilder, TransactionBuilder> rules, int size = 100)
        {
            var transactions = BuildTransactions(rules, size);
            var controller = GetService<TransactionController>();
            return controller.BatchSave(TransactionOperationBatch.SaveBatch(transactions)
                , CancellationToken.None);
        }

        public Task PrepareArticlesWith(Func<ArticleBuilder, ArticleBuilder> rules, int size = 100)
        {
            var transactions = BuildArticles(rules, size);
            DbContext.Article.AddRange(transactions);
            return DbContext.SaveChangesAsync(CancellationToken.None);
        }

        #endregion

        #region  Nonpublic Methods

        public T GetService<T>()
        {
            if (_services == null)
            {
                _services = _rootServices.CreateScope();
            }
            return (T)_services.ServiceProvider.GetRequiredService(typeof(T));
        }

        public IList<Transaction> BuildTransactions(Func<TransactionBuilder, TransactionBuilder> rules, int size = 100)
        {
            var transactions = rules(TransactionBuilder.CreateListOfSize(size)
                    .All().WithName("Nothing").WithCategory(null))
                .BuildList();
            return transactions;
        }

        public IList<Article> BuildArticles(Func<ArticleBuilder, ArticleBuilder> rules, int size = 100)
        {
            var transactions = rules(ArticleBuilder.CreateListOfSize(size).All())
                .BuildList();
            return transactions;
        }

        #endregion

        public List<Article> CreateArticlesFromTransactions(IList<Transaction> trans)
        {
            var articles = trans.Select(e => new Article
            {
                Name = e.Name,
                LastWallet = WalletCash,
                Category = String.Empty
            }).ToList();
            DbContext.Article.AddRange(articles);
            return articles;
        }
    }
}