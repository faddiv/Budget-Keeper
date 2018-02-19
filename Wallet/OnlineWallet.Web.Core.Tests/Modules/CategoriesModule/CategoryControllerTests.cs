using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.Modules.GeneralDataModule;
using OnlineWallet.Web.TestHelpers;
using TestStack.Dossier.Lists;
using Xunit;

namespace OnlineWallet.Web.Modules.CategoriesModule
{
    [Trait(nameof(CategoryController), nameof(CategoryController.GetBy))]
    [Collection("Database collection")]
    public class CategoryControllerTests : IDisposable
    {
        #region Fields

        private readonly DatabaseFixture _fixture;
        private readonly CategoryController _controller;

        #endregion

        #region  Constructors

        public CategoryControllerTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
            _controller = _fixture.GetService<CategoryController>();
        }

        #endregion

        public void Dispose()
        {
            _fixture.Cleanup();
        }

        [Fact(DisplayName = nameof(Returns_the_categories_from_transactions))]
        public async Task Returns_the_categories_from_transactions()
        {
            _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithCategory("Alfa")
                .TheNext(5).WithCategory("alfa")
            );

            var result = await _controller.GetBy();

            result.Should()
                .NotBeNullOrEmpty().And
                .HaveCount(2);
            result.Select(e => e.Name).Should().OnlyHaveUniqueItems();
        }

        [Fact(DisplayName = nameof(Dont_return_null_or_empty_category))]
        public async Task Dont_return_null_or_empty_category()
        {
            _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithCategory("Alfa")
                .TheNext(5).WithCategory("")
                .TheNext(5).WithCategory(null)
            );

            var result = await _controller.GetBy();

            result.Should()
                .NotBeNullOrEmpty().And
                .HaveCount(1);
        }

        [Fact(DisplayName = nameof(Returns_max_10_categories))]
        public async Task Returns_max_10_categories()
        {
            _fixture.PrepareDataWith(tr => tr
                .All().WithCategoryRandom()
            );

            var result = await _controller.GetBy();

            result.Should()
                .NotBeNullOrEmpty().And
                .HaveCount(10);
            result.Select(e => e.Name).Should().OnlyHaveUniqueItems();
        }

        [Fact(DisplayName = nameof(Returns_the_given_limit_categories))]
        public async Task Returns_the_given_limit_categories()
        {
            _fixture.PrepareDataWith(tr => tr
                .All().WithCategoryRandom()
            );

            var result = await _controller.GetBy("", 5);

            result.Should()
                .NotBeNullOrEmpty().And
                .HaveCount(5);
            result.Select(e => e.Name).Should().OnlyHaveUniqueItems();
        }

        [Fact(DisplayName = nameof(Search_is_contains_case_insensitive_and_ignore_space))]
        public async Task Search_is_contains_case_insensitive_and_ignore_space()
        {
            _fixture.PrepareDataWith(tr => tr
                .TheFirst(2).WithCategory("sAlfas")
                .TheNext(2).WithCategory("salfas")
                .TheNext(2).WithCategory("al fa")
                .TheNext(2).WithCategory("beta")
                .TheNext(2).WithCategory("alfs")
            );

            var result = await _controller.GetBy("alfa");

            result.Should()
                .NotBeNullOrEmpty()
                .And.Contain(e => e.Name == "sAlfas")
                .And.Contain(e => e.Name == "salfas")
                .And.Contain(e => e.Name == "al fa")
                .And.NotContain(e => e.Name == "beta")
                .And.NotContain(e => e.Name == "alfs");
        }

        [Fact(DisplayName = nameof(Result_ordered_by_occurende_descending))]
        public async Task Result_ordered_by_occurende_descending()
        {
            _fixture.PrepareDataWith(tr => tr
                .TheFirst(1).WithCategory("a")
                .TheNext(5).WithCategory("b")
                .TheNext(3).WithCategory("c")
                .TheNext(2).WithCategory("d")
                .TheNext(4).WithCategory("e")
            );

            var result = await _controller.GetBy();

            result.Should()
                .NotBeNullOrEmpty();
            result.Select(e => e.Occurence).Should().OnlyHaveUniqueItems();
            result.Select(e => e.Occurence).Should().BeInDescendingOrder();
        }


        [Fact(DisplayName = nameof(Highlights_the_match_in_name))]
        public async Task Highlights_the_match_in_name()
        {
            _fixture.PrepareDataWith(tr => tr
                .TheFirst(3).WithCategory("alfa1")
                .TheNext(3).WithCategory("2alfa")
                .TheNext(3).WithCategory("3alfa3")
                .TheNext(3).WithCategory("xaclafaa")
                .TheNext(3).WithCategory("xalxfax")
            );

            var result = await _controller.GetBy("alfa");

            result.Should()
                .HaveCount(5).And
                .Contain(e => e.NameHighlighted == "<strong>alfa</strong>1").And
                .Contain(e => e.NameHighlighted == "2<strong>alfa</strong>").And
                .Contain(e => e.NameHighlighted == "3<strong>alfa</strong>3").And
                .Contain(e => e.NameHighlighted == "x<strong>al</strong>x<strong>fa</strong>x");
        }
    }
}
