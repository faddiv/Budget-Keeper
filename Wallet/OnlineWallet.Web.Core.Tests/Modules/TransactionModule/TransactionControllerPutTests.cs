using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait("TransactionController", "Put")]
    public class TransactionControllerPutTests : TransactionControllerTests
    {
        public TransactionControllerPutTests(DatabaseFixture fixture) : base(fixture)
        {
        }


        [Fact(DisplayName = "Put_returns_BadRequest_if_no_name_provided")]
        public async Task Put_returns_BadRequest_if_no_name_provided()
        {
            //Arrange
            var entity = Fixture.Clone(TestTransaction);
            entity.Name = null;
            ControllerTestHelpers.AddModelErrorsFrom(entity, Controller);

            //Act
            var result = await Controller.Put(entity.TransactionId, entity, CancellationToken.None);

            //Assert
            ControllerTestHelpers.ResultShouldBeBadRequest(result);
        }

        [Fact(DisplayName = "Post_saves_new_wallet_if_everything_is_ok")]
        public async Task Put_updates_wallet_if_everything_is_ok()
        {
            //Arrange
            var entity = Fixture.Clone(TestTransaction);
            entity.Name = "Changed Transaction";
            ControllerTestHelpers.AddModelErrorsFrom(entity, Controller);

            //Act
            var result = await Controller.Put(entity.TransactionId, entity, CancellationToken.None);

            //Assert
            ResultShouldBeOk(result, HttpStatusCode.OK);
            DbSet.Should().Contain(e => e.TransactionId == TestTransaction.TransactionId && e.Name == "Changed Transaction");
        }
    }
}