using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait("TransactionController", "Delete")]
    public class TransactionControllerDeleteTests : TransactionControllerTests
    {
        public TransactionControllerDeleteTests(DatabaseFixture fixture)
            : base(fixture)
        {

        }

        [Fact(DisplayName = "Delete_deletes_line_if_possible")]
        public async Task Delete_deletes_line_if_possible()
        {
            //Act
            var result = await Controller.Delete(TestTransaction.TransactionId, CancellationToken.None);

            //Assert
            ResultShouldBeOk(result, HttpStatusCode.OK);
            DbSet.Should().NotContain(e => e.TransactionId == TestTransaction.TransactionId);

        }

        [Fact(DisplayName = "Delete_returns_NotFound_if_object_doesnt_exists")]
        public async Task Delete_returns_NotFound_if_object_doesnt_exists()
        {
            //Act
            var result = await Controller.Delete(TestTransaction.TransactionId + 100, CancellationToken.None);

            //Assert
            ResultShouldBeNotFound(result);

        }
    }
}