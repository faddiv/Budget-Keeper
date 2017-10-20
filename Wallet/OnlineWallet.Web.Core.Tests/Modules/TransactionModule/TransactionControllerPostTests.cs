using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait("TransactionController", "Post")]
    public class TransactionControllerPostTests : TransactionControllerTests
    {
        public TransactionControllerPostTests(DatabaseFixture fixture) : base(fixture)
        {
        }


        [Fact(DisplayName = "Post_returns_BadRequest_if_no_name_provided")]
        public async Task Post_returns_BadRequest_if_no_name_provided()
        {
            //Arrange
            var entity = new TransactionBuilder().WithName(null).Build();
            ControllerTestHelpers.AddModelErrorsFrom(entity, Controller);

            //Act
            var result = await Controller.Post(entity, CancellationToken.None);

            //Assert
            ResultShouldBeBadRequest(result);
        }


        [Fact(DisplayName = "Post_saves_new_transaction_if_everything_is_ok")]
        public async Task Post_saves_new_transaction_if_everything_is_ok()
        {
            //Arrange
            var entity = new TransactionBuilder().WithName("New Transaction").Build();
            ControllerTestHelpers.AddModelErrorsFrom(entity, Controller);

            //Act
            var result = await Controller.Post(entity, CancellationToken.None);

            //Assert
            ResultShouldBeOk(result, HttpStatusCode.Created);
            DbSet.Should().Contain(e => e.Name == "New Transaction");
        }
    }
}