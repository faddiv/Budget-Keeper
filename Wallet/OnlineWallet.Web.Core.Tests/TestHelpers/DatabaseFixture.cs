using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.TestHelpers
{
    public class DatabaseFixture : IDisposable
    {
        #region  Constructors

        public DatabaseFixture()
        {
            AutoMapper.Mapper.Initialize(config =>
            {
                config.CreateMap(typeof(Transaction), typeof(Transaction));
                config.CreateMap(typeof(Wallet), typeof(Wallet));
            });
        }

        #endregion

        #region  Public Methods

        public ServicesFixture CreateServiceFixture(Action<ServiceCollection> setup = null)
        {
            return new ServicesFixture(setup);
        }

        public ServicesFixture CreateServiceFixture(params Mock[] mocks)
        {
            return new ServicesFixture(s =>
            {
                foreach (var mock in mocks)
                {
                    var serviceType = mock.Object.GetType().GetInterfaces().First(e =>
                        !e.Name.StartsWith("IMocked") && e.Name != "IProxyTargetAccessor");
                    s.RemoveAll(e => e.ServiceType == serviceType);
                    s.AddSingleton(serviceType, mock.Object);
                }
            });
        }

        public void Dispose()
        {
            // Dispose
        }

        #endregion
    }
}