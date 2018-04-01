using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.TransactionModule;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.TestHelpers.Builders;

namespace OnlineWallet.Web.TestHelpers
{
    public class ServicesFixture : IDisposable
    {
        #region Fields

        private readonly IDisposable _disposable;
        private readonly DatabaseFixture _fixture;
        private readonly IServiceScope _services;

        #endregion

        #region  Constructors

        public ServicesFixture(DatabaseFixture fixture, Action<ServiceCollection> setup = null)
        {
            _fixture = fixture;
            var services = new ServiceCollection();
            services.AddSingleton<IWalletDbContext>(_fixture.DbContext);
            Startup.AddWalletServices(services);
            foreach (var controller in typeof(Startup).Assembly.GetTypes()
                .Where(e => typeof(ControllerBase).IsAssignableFrom(e)))
            {
                services.AddScoped(controller);
            }

            setup?.Invoke(services);
            var containerBuilder = new Autofac.ContainerBuilder();
            containerBuilder.Populate(services);
            var container = containerBuilder.Build();
            _disposable = container;
            var rootServices = new AutofacServiceProvider(container);
            _services = rootServices.CreateScope();
        }

        #endregion

        #region Properties

        public WalletDbContext DbContext => _fixture.DbContext;
        public Wallet WalletBankAccount => _fixture.WalletBankAccount;
        public Wallet WalletCash => _fixture.WalletCash;

        #endregion

        #region  Public Methods

        public void Cleanup()
        {
            _fixture.Cleanup();
        }

        public TEntity Clone<TEntity>(TEntity original) => _fixture.Clone(original);

        public void Dispose()
        {
            _fixture.Dispose();
            _disposable.Dispose();
        }

        public Task PrepareDataWith(Func<TransactionBuilder, TransactionBuilder> rules, int size = 100)
        {
            var transactions = _fixture.BuildTransactions(rules, size);
            var controller = GetService<TransactionController>();
            return controller.BatchSave(new TransactionOperationBatch(transactions)
                , CancellationToken.None);
        }

        public Task PrepareArticlesWith(Func<ArticleBuilder, ArticleBuilder> rules, int size = 100)
        {
            var transactions = _fixture.BuildArticles(rules, size);
            DbContext.Article.AddRange(transactions);
            return DbContext.SaveChangesAsync();
        }

        #endregion

        #region  Nonpublic Methods

        internal T GetService<T>()
        {
            return (T) _services.ServiceProvider.GetRequiredService(typeof(T));
        }

        #endregion
    }
}