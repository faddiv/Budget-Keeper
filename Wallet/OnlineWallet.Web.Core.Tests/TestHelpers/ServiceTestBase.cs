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

        protected void ResultShouldBeNotFound(ActionResult result)
        {
            result.Should()
                .NotBeNull().And
                .BeOfType(typeof(NotFoundResult));
            var jsonResult = (NotFoundResult) result;
            jsonResult.StatusCode.Should().Be((int) HttpStatusCode.NotFound);
        }

        protected void ResultShouldBeOk(ActionResult result, HttpStatusCode statusCode)
        {
            result.Should()
                .NotBeNull().And
                .BeOfType(typeof(JsonResult));
            var jsonResult = (JsonResult) result;
            jsonResult.StatusCode.Should().Be((int) statusCode);
        }

        protected virtual TestServices Setup(TestServiceProviderFixture provider)
        {
            return provider.CreateServiceFixture();
        }

        #endregion
    }
}