using System;
using System.Linq;
using FluentAssertions;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.TestHelpers;
using TestStack.Dossier.Lists;
using Xunit;
using Xunit.Abstractions;

namespace OnlineWallet.Web.Modules.StatisticsModule
{
    [Trait(nameof(StatisticsController), nameof(StatisticsController.Yearly))]
    [Collection("Database collection")]
    public class StatisticsControllerTests : IDisposable
    {
        #region Fields

        private readonly DatabaseFixture _fixture;
        private readonly ITestOutputHelper output;

        #endregion

        #region  Constructors

        public StatisticsControllerTests(DatabaseFixture fixture, ITestOutputHelper output)
        {
            _fixture = fixture;
            this.output = output;
        }

        #endregion

        public void Dispose()
        {
            _fixture.Cleanup();
        }

        [Fact(DisplayName = nameof(ReturnsYearlyIncome))]
        public void ReturnsYearlyIncome()
        {
            var statistics = PrepareDataAndRunTest(MoneyDirection.Income, MoneyDirection.Expense, MoneyDirection.Plan);

            statistics.Should().NotBeNull();
            statistics.Income.Should().Be(70, "it sums all the income in the given year");
        }

        [Fact(DisplayName = nameof(ReturnsYearlyExpense))]
        public void ReturnsYearlyExpense()
        {
            var statistics = PrepareDataAndRunTest(MoneyDirection.Expense, MoneyDirection.Income, MoneyDirection.Plan);

            statistics.Should().NotBeNull();
            statistics.Spent.Should().Be(70, "it sums all the expense in the given year");
        }

        [Fact(DisplayName = nameof(ReturnsYearlyPlan))]
        public void ReturnsYearlyPlan()
        {
            var statistics = PrepareDataAndRunTest(MoneyDirection.Plan, MoneyDirection.Income, MoneyDirection.Expense);

            statistics.Should().NotBeNull();
            statistics.Planned.Should().Be(70, "it sums all the expense in the given year");
        }

        [Fact(DisplayName = nameof(ReturnsYearlySavings))]
        public void ReturnsYearlySavings()
        {
            var statistics = PrepareDataAndRunTest(MoneyDirection.Income, MoneyDirection.Expense, MoneyDirection.Plan);

            statistics.Should().NotBeNull();
            statistics.ToSaving.Should().Be(18, "it calculates savings in the given year");
        }

        [Fact(DisplayName = nameof(ReturnsYearlyUnused))]
        public void ReturnsYearlyUnused()
        {
            var statistics = PrepareDataAndRunTest(MoneyDirection.Income, MoneyDirection.Expense, MoneyDirection.Plan);

            statistics.Should().NotBeNull();
            statistics.Unused.Should().Be(17, "it calculates savings in the given year");
        }

        [Fact(DisplayName = nameof(ReturnsZerosForEmptyYear))]
        public void ReturnsZerosForEmptyYear()
        {
            var controller = new StatisticsController(_fixture.DbContext);

            var statistics = controller.Yearly(2017);
            statistics.Should().NotBeNull();
            statistics.Income.Should().Be(0);
            statistics.Spent.Should().Be(0);
            statistics.Planned.Should().Be(0);
            statistics.ToSaving.Should().Be(0);
            statistics.Unused.Should().Be(0);
        }

        private YearlyStatistics PrepareDataAndRunTest(MoneyDirection tested, MoneyDirection rest1, MoneyDirection rest2)
        {
            _fixture.PrepareDataWith(r => r
                            .All().WithValue(1).WithCreatedAt("2017.01.01", "2017.12.31")
                            .TheFirst(15).WithCreatedAt("2016.12.31").WithValue(100)
                            .TheNext(15).WithCreatedAt("2018.01.01").WithValue(100)
                            .TheNext(35).WithDirection(tested).WithValue(2)
                            .TheNext(25).WithDirection(rest1)
                            .TheNext(10).WithDirection(rest2)
                            );
            var controller = new StatisticsController(_fixture.DbContext);

            var statistics = controller.Yearly(2017);
            return statistics;
        }

        [Fact(DisplayName = nameof(ReturnsMonthlySummaries))]
        public void ReturnsMonthlySummaries()
        {
            _fixture.PrepareDataWith(r =>
            {
                r = r.TheFirst(0);
                for (int i = 1; i <= 12; i++)
                {
                    r = r.TheNext(100)
                        .WithValue(1)
                        .WithDirection(MoneyDirection.Income)
                        .WithCreatedAt(2017, i);

                    r = r.TheNext(10)
                        .WithValue(1)
                        .WithDirection(MoneyDirection.Expense)
                        .WithCreatedAt(2017, i);

                    r = r.TheNext(10)
                        .WithValue(1)
                        .WithDirection(MoneyDirection.Plan)
                        .WithCreatedAt(2017, i);
                }
                return r;
            }, (100 + 10 + 10) *12);

            var controller = new StatisticsController(_fixture.DbContext);

            var statistics = controller.Yearly(2017);
            statistics.Should().NotBeNull();
            statistics.Income.Should().Be(1200);
            statistics.Spent.Should().Be(120);
            statistics.Planned.Should().Be(120);
            statistics.ToSaving.Should().Be(300);
            statistics.Unused.Should().Be(660);

            statistics.Monthly.Should().NotBeNull();
            statistics.Monthly.Should().HaveCount(12);
            foreach (var item in statistics.Monthly)
            {
                item.Should().NotBeNull();
                item.Income.Should().Be(100);
                item.Spent.Should().Be(10);
                item.Planned.Should().Be(10);
                item.ToSaving.Should().Be(25);
                item.Unused.Should().Be(55);
            }
        }

        [Fact(DisplayName = nameof(ReturnsZeroMotnhlyDataForEmptyYear))]
        public void ReturnsZeroMotnhlyDataForEmptyYear()
        {
            var controller = new StatisticsController(_fixture.DbContext);

            var statistics = controller.Yearly(2017);
            statistics.Should().NotBeNull();
            statistics.Monthly.Should().NotBeNull();
            statistics.Monthly.Should().HaveCount(12);
            foreach (var item in statistics.Monthly)
            {
                statistics.Should().NotBeNull();
                statistics.Income.Should().Be(0);
                statistics.Spent.Should().Be(0);
                statistics.Planned.Should().Be(0);
                statistics.ToSaving.Should().Be(0);
                statistics.Unused.Should().Be(0);
            }
        }

    }
}
