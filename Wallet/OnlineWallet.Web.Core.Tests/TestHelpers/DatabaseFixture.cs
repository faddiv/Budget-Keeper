using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions.Common;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using Moq;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers.Builders;
using TestStack.Dossier.Lists;

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

        #region Properties

        #endregion

        #region  Public Methods
        
        public ServicesFixture CreateServiceFixture(Action<ServiceCollection> setup = null)
        {
            return new ServicesFixture(this, setup);
        }

        public ServicesFixture CreateServiceFixture(params Mock[] mocks)
        {
            return new ServicesFixture(this, s =>
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