using System;
using System.Linq;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.TestHelpers
{
    public class TestServicesFactory
    {
        #region  Constructors

        static TestServicesFactory()
        {
            Map = new Mapper(new MapperConfiguration(config =>
            {
                config.CreateMap(typeof(Transaction), typeof(Transaction));
                config.CreateMap(typeof(Wallet), typeof(Wallet));
            }));
        }

        #endregion

        #region Properties

        public static IMapper Map { get; }

        #endregion

        #region  Public Methods

        public static TestServices CreateServiceFixture(Action<ServiceCollection> setup = null)
        {
            return new TestServices(setup, Map);
        }

        public static TestServices CreateServiceFixture(params Mock[] mocks)
        {
            return new TestServices(s =>
            {
                foreach (var mock in mocks)
                {
                    var serviceType = mock.Object.GetType().GetInterfaces().First(e =>
                        !e.Name.StartsWith("IMocked") && e.Name != "IProxyTargetAccessor");
                    s.RemoveAll(e => e.ServiceType == serviceType);
                    s.AddSingleton(serviceType, mock.Object);
                }
            }, Map);
        }

        #endregion
    }
}