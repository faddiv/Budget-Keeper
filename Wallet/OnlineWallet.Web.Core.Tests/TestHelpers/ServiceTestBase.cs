using System;

namespace OnlineWallet.Web.TestHelpers
{
    public class ServiceTestBase : IDisposable
    {
        #region  Constructors

        public ServiceTestBase()
        {
            Fixture = TestServicesFactory.CreateServiceFixture();
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
    }
}