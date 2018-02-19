using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.Modules.TransactionModule;
using OnlineWallet.Web.Modules.TransactionModule.Models;
using OnlineWallet.Web.TestHelpers;
using TestStack.Dossier.Lists;
using Xunit;
using Xunit.Abstractions;

namespace OnlineWallet.Web.Modules.StatisticsModule
{
    [Trait(nameof(StatisticsController), nameof(StatisticsController.Categories))]
    [Collection("Database collection")]
    public class StatisticsControllerMonthlyTests : IDisposable
    {
        #region Fields

        private readonly DatabaseFixture _fixture;
        private readonly ITestOutputHelper output;

        #endregion

        #region  Constructors

        public StatisticsControllerMonthlyTests(DatabaseFixture fixture, ITestOutputHelper output)
        {
            _fixture = fixture;
            this.output = output;
        }

        #endregion

        public void Dispose()
        {
            _fixture.Cleanup();
        }

        [Fact(DisplayName = nameof(Should_load_yearly_category_statistics_for_empty_year))]
        public async Task Should_load_yearly_category_statistics_for_empty_year()
        {
            var controller = _fixture.GetService<StatisticsController>();

            var statistics = await controller.Categories(2017);
            statistics.Should().NotBeNull();
            statistics.Yearly.Should().NotBeNull();
            statistics.Yearly.Should().HaveCount(0);
            statistics.Monthly.Should().NotBeNull();
            statistics.Monthly.Should().HaveCount(12);
            statistics.Monthly.Should().OnlyContain(e => e != null && e.Count == 0);

        }
        [Fact(DisplayName = nameof(Should_load_yearly_category_statistics))]
        public async Task Should_load_yearly_category_statistics()
        {
            _fixture.PrepareDataWith(r => r
                          .All()
                            .WithValue(1)
                            .WithDirection(MoneyDirection.Expense)
                            .WithCreatedAt("2017.01.01", "2017.12.31")
                            .WithCategory("food")
                          .TheFirst(15).WithCreatedAt("2016.12.31").WithValue(100)
                          .TheNext(15).WithCreatedAt("2018.01.01").WithValue(100)
                            );
            var controller = _fixture.GetService<StatisticsController>();

            var statistics = await controller.Categories(2017);
            statistics.Should().NotBeNull();
            statistics.Yearly.Should().NotBeNull();
            statistics.Yearly.Should().HaveCount(1);
            statistics.Yearly[0].Name.Should().Be("food");
            statistics.Yearly[0].Count.Should().Be(70);
            statistics.Yearly[0].Spent.Should().Be(70);
            statistics.Yearly[0].SpentPercent.Should().Be(1);
        }

        [Fact(DisplayName = nameof(Should_load_monthly_category_statistics))]
        public async Task Should_load_monthly_category_statistics()
        {
            _fixture.PrepareDataWith(r => r
                          .All()
                            .WithValue(1)
                            .WithDirection(MoneyDirection.Expense)
                            .WithCreatedAt("2017.01.01", "2017.11.30")
                            .WithCategory("food")
                          .TheFirst(15).WithCreatedAt("2016.12.31").WithValue(100)
                          .TheNext(15).WithCreatedAt("2018.01.01").WithValue(100)
                            );
            var controller = _fixture.GetService<StatisticsController>();

            var statistics = await controller.Categories(2017);
            statistics.Should().NotBeNull();
            statistics.Monthly.Should().NotBeNull();
            statistics.Monthly.Should().HaveCount(12);
            var allMonth = statistics.Monthly.SelectMany(e => e);
            allMonth.Should().OnlyContain(e => e.Name == "food");
            allMonth.Sum(e => e.Count).Should().Be(70);
            allMonth.Sum(e => e.Spent).Should().Be(70);
        }

        [Fact(DisplayName = nameof(Should_group_by_category))]
        public async Task Should_group_by_category()
        {
            _fixture.PrepareDataWith(r => r
                          .All()
                            .WithValue(1)
                            .WithDirection(MoneyDirection.Expense)
                            .WithCreatedAt("2017.01.01", "2017.12.31")
                            .WithCategory(null)
                          .TheFirst(30).WithCategory("food")
                          .TheNext(30).WithCategory("rest")
                          .TheNext(30).WithCategory("boo")
                            );
            var controller = _fixture.GetService<StatisticsController>();

            var statistics = await controller.Categories(2017);
            statistics.Yearly.Should().HaveCount(4);
            var names = statistics.Yearly.Select(e => e.Name);
            names.Should().OnlyHaveUniqueItems();
            names.Should().Contain("", "null and empty converted to empty");
            ShouldYearlyCategoryCorrect("food", statistics);
            ShouldYearlyCategoryCorrect("rest", statistics);
            ShouldYearlyCategoryCorrect("boo", statistics);
            ShouldYearlyCategoryCorrect("", statistics, 10);
        }

        private static void ShouldYearlyCategoryCorrect(string name, CategoryStatisticsSummary statistics, int count = 30)
        {
            CategoryStatistics categoryStatistics = statistics.YearlyByName(name);
            categoryStatistics.Should().NotBeNull();
            categoryStatistics.Count.Should().Be(count);
            categoryStatistics.Spent.Should().Be(count);
            categoryStatistics.SpentPercent.Should().Be(count / 100.0);
        }
    }
}
