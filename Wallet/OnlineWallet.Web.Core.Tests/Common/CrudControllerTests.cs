using System;
using System.Net;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Common
{
    [Collection("Provide Test Service")]
    public class CrudControllerTests<TEntity> : IDisposable where TEntity : class
    {
        protected TestServices Fixture { get; }
        
        public CrudControllerTests(TestServiceProviderFixture fixture)
        {
            Fixture = fixture.CreateServiceFixture();
        }

        protected void ResultShouldBeOk(ActionResult result, HttpStatusCode statusCode)
        {
            result.Should()
                .NotBeNull().And
                .BeOfType(typeof(JsonResult));
            var jsonResult = (JsonResult)result;
            jsonResult.StatusCode.Should().Be((int)statusCode);
        }

        protected void ResultShouldBeNotFound(ActionResult result)
        {
            result.Should()
                .NotBeNull().And
                .BeOfType(typeof(NotFoundResult));
            var jsonResult = (NotFoundResult)result;
            jsonResult.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
        }

        public void Dispose()
        {
            Fixture.Cleanup();
        }
    }
}
