using System;
using System.Linq;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers.Builders;

namespace OnlineWallet.Web.TestHelpers
{
    public class ServicesFixture : IDisposable
    {
        private readonly DatabaseFixture _fixture;
        public WalletDbContext DbContext => _fixture.DbContext;
        public Wallet WalletCash => _fixture.WalletCash;
        public Wallet WalletBankAccount => _fixture.WalletBankAccount;
        private readonly IServiceScope _services;
        private readonly IDisposable _disposable;

        internal T GetService<T>()
        {
            return (T)_services.ServiceProvider.GetRequiredService(typeof(T));
        }

        public ServicesFixture(DatabaseFixture fixture, Action<ServiceCollection> setup = null)
        {
            _fixture = fixture;
            var services = new ServiceCollection();
            services.AddSingleton<IWalletDbContext>(_fixture.DbContext);
            Startup.AddWalletServices(services);
            foreach (var controller in typeof(Startup).Assembly.GetTypes().Where(e => typeof(ControllerBase).IsAssignableFrom(e)))
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
        
        public void Dispose()
        {
            _fixture.Dispose();
            _disposable.Dispose();
        }
        
        public void Cleanup()
        {
            _fixture.Cleanup();
        }

        public void PrepareDataWith(Func<TransactionBuilder, TransactionBuilder> rules, int size = 100)
        {
            _fixture.PrepareDataWith(rules, size);
        }

        public TEntity Clone<TEntity>(TEntity original) => _fixture.Clone(original);
    }
}