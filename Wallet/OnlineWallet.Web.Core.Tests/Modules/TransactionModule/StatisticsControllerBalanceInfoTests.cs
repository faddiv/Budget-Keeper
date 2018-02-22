using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using TestStack.Dossier.Lists;
using Xunit;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait(nameof(StatisticsController), nameof(StatisticsController.BalanceInfo))]
    [Collection("Database collection")]
    public class StatisticsControllerBalanceInfoTests : IDisposable
    {
        #region Fields

        private readonly DatabaseFixture _fixture;

        #endregion

        #region  Constructors

        public StatisticsControllerBalanceInfoTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
            BuildDataWith(MoneyDirection.Expense, 0);
            BuildDataWith(MoneyDirection.Plan, -15);
            BuildDataWith(MoneyDirection.Income, 25);

            _fixture.DbContext.SaveChanges();
        }

        #endregion

        private void BuildDataWith(MoneyDirection direction, int shift)
        {
            var transactions = TransactionBuilder.CreateListOfSize(4)
                            .TheFirst(1).WithCreatedAt("2017-08-31").WithValue(10 + shift)
                            .TheNext(1).WithCreatedAt("2017-09-01").WithValue(20 + shift)
                            .TheNext(1).WithCreatedAt("2017-09-30").WithValue(30 + shift)
                            .TheNext(1).WithCreatedAt("2017-10-01").WithValue(40 + shift)
                            .All().WithDirection(direction)
                            .BuildList();
            _fixture.DbContext.Transactions.AddRange(transactions);
        }

        [Fact(DisplayName = nameof(Queries_BalanceInfo_for_the_given_month))]
        public async Task Queries_BalanceInfo_for_the_given_month()
        {
            var controller = _fixture.GetService<StatisticsController>();

            var result = await controller.BalanceInfo(2017, 9, CancellationToken.None);

            result.Should().NotBeNull();
            result.Income.Should().Be(100);
            result.Planned.Should().Be(20);
            result.Spent.Should().Be(50);
            result.ToSaving.Should().Be(25);
            result.Unused.Should().Be(5);
        }

        public void Dispose()
        {
            _fixture.Cleanup();
        }

    }
}
