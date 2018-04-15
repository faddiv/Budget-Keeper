using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.TestHelpers;
using TestStack.Dossier.Lists;
using Xunit;
using Xunit.Abstractions;

namespace OnlineWallet.Web.Modules.TransactionModule
{
    [Trait(nameof(StatisticsController), nameof(StatisticsController.Yearly))]
    [Collection("Provide Test Service")]
    public class StatisticsControllerYearlyTests : IDisposable
    {
        #region Fields

        private readonly TestServices _fixture;

        #endregion

        #region  Constructors

        public StatisticsControllerYearlyTests(TestServiceProviderFixture fixture)
        {
            _fixture = fixture.CreateServiceFixture();
        }

        #endregion

        public void Dispose()
        {
            _fixture.Cleanup();
        }

        [Fact(DisplayName = nameof(Returns_yearly_income))]
        public async Task Returns_yearly_income()
        {
            var statistics = await PrepareDataAndRunTest(MoneyDirection.Income, MoneyDirection.Expense, MoneyDirection.Plan);

            statistics.Should().NotBeNull();
            statistics.Income.Should().Be(70, "it sums all the income in the given year");
        }

        [Fact(DisplayName = nameof(Returns_yearly_expense))]
        public async Task Returns_yearly_expense()
        {
            var statistics = await PrepareDataAndRunTest(MoneyDirection.Expense, MoneyDirection.Income, MoneyDirection.Plan);

            statistics.Should().NotBeNull();
            statistics.Spent.Should().Be(70, "it sums all the expense in the given year");
        }

        [Fact(DisplayName = nameof(Returns_yearly_plan))]
        public async Task Returns_yearly_plan()
        {
            var statistics = await PrepareDataAndRunTest(MoneyDirection.Plan, MoneyDirection.Income, MoneyDirection.Expense);

            statistics.Should().NotBeNull();
            statistics.Planned.Should().Be(70, "it sums all the expense in the given year");
        }

        [Fact(DisplayName = nameof(Returns_yearly_savings))]
        public async Task Returns_yearly_savings()
        {
            var statistics = await PrepareDataAndRunTest(MoneyDirection.Income, MoneyDirection.Expense, MoneyDirection.Plan);

            statistics.Should().NotBeNull();
            statistics.ToSaving.Should().Be(18, "it calculates savings in the given year");
        }

        [Fact(DisplayName = nameof(Returns_yearly_unused))]
        public async Task Returns_yearly_unused()
        {
            var statistics = await PrepareDataAndRunTest(MoneyDirection.Income, MoneyDirection.Expense, MoneyDirection.Plan);

            statistics.Should().NotBeNull();
            statistics.Unused.Should().Be(17, "it calculates savings in the given year");
        }

        [Fact(DisplayName = nameof(Returns_zeros_for_empty_year))]
        public async Task Returns_zeros_for_empty_year()
        {
            var controller = _fixture.GetService<StatisticsController>();

            var statistics = await controller.Yearly(2017);
            statistics.Should().NotBeNull();
            statistics.Income.Should().Be(0);
            statistics.Spent.Should().Be(0);
            statistics.Planned.Should().Be(0);
            statistics.ToSaving.Should().Be(0);
            statistics.Unused.Should().Be(0);
        }

        private async Task<YearlyStatistics> PrepareDataAndRunTest(MoneyDirection tested, MoneyDirection rest1, MoneyDirection rest2)
        {
            await _fixture.PrepareDataWith(r => r
                            .All().WithValue(1).WithCreatedAt("2017.01.01", "2017.12.31")
                            .TheFirst(15).WithCreatedAt("2016.12.31").WithValue(100)
                            .TheNext(15).WithCreatedAt("2018.01.01").WithValue(100)
                            .TheNext(35).WithDirection(tested).WithValue(2)
                            .TheNext(25).WithDirection(rest1)
                            .TheNext(10).WithDirection(rest2)
                            );
            var controller = _fixture.GetService<StatisticsController>();

            var statistics = await controller.Yearly(2017);
            return statistics;
        }

        [Fact(DisplayName = nameof(Returns_monthly_summaries))]
        public async Task Returns_monthly_summaries()
        {
            await _fixture.PrepareDataWith(r =>
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
            }, (100 + 10 + 10) * 12);

            var controller = _fixture.GetService<StatisticsController>();

            var statistics = await controller.Yearly(2017);
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

        [Fact(DisplayName = nameof(Returns_zero_monthly_data_for_empty_year))]
        public async Task Returns_zero_monthly_data_for_empty_year()
        {
            var controller = _fixture.GetService<StatisticsController>();

            var statistics = await controller.Yearly(2017);
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
