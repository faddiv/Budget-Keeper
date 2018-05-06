using System.Net;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.TestHelpers;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    public class WalletControllerTests : ServiceTestBase
    {
        protected WalletController Controller { get; }
        protected Wallet TestWallet { get; }

        public WalletControllerTests()
        {
            Controller = Fixture.GetService<WalletController>();
            TestWallet = new Wallet
            {
                Name = "Test"
            };
            Fixture.DbContext.Wallets.Add(TestWallet);
            Fixture.DbContext.SaveChanges();
        }


        protected void ResultShouldBeNotFound(ActionResult result)
        {
            result.Should()
                .NotBeNull().And
                .BeOfType(typeof(NotFoundResult));
            var jsonResult = (NotFoundResult)result;
            jsonResult.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
        }

        protected void ResultShouldBeOk(ActionResult result, HttpStatusCode statusCode)
        {
            result.Should()
                .NotBeNull().And
                .BeOfType(typeof(JsonResult));
            var jsonResult = (JsonResult)result;
            jsonResult.StatusCode.Should().Be((int)statusCode);
        }

    }
}