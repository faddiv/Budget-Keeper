using System;
using System.Net;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;

namespace OnlineWallet.Web.TestHelpers
{
    public class ServiceTestBase : IDisposable
    {
        #region  Constructors

        public ServiceTestBase()
        {
            var provider = new TestServiceProviderFixture();
            // ReSharper disable once VirtualMemberCallInConstructor
            Fixture = Setup(provider);
        }

        #endregion

        #region Properties

        public TestServices Fixture { get; }

        #endregion

        #region  Public Methods

        public virtual void Dispose()
        {
            Fixture?.Dispose();
        }

        #endregion

        #region  Nonpublic Methods

        protected virtual TestServices Setup(TestServiceProviderFixture provider)
        {
            return provider.CreateServiceFixture();
        }

        #endregion
    }
}