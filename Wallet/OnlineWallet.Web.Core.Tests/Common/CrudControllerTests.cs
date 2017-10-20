using System;
using System.Net;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Common
{
    [Collection("Database collection")]
    public class CrudControllerTests : IDisposable
    {
        protected DatabaseFixture Fixture { get; }

        public CrudControllerTests(DatabaseFixture fixture)
        {
            Fixture = fixture;
        }

        protected static void ResultShouldBeBadRequest(ActionResult result)
        {
            result.Should()
                .NotBeNull().And
                .BeOfType(typeof(ContentResult));
            var contentResult = (ContentResult)result;
            contentResult.StatusCode.Should().Be((int)HttpStatusCode.BadRequest);
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
