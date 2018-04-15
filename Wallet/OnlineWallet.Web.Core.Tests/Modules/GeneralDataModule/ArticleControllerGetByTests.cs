using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using TestStack.Dossier.Lists;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule
{
    [Trait(nameof(ArticleController), nameof(ArticleController.GetBy))]
    public class ArticleControllerGetByTests : ServiceTestBase
    {
        private readonly ArticleController _controller;

        public ArticleControllerGetByTests()
        {
            _controller = _fixture.GetService<ArticleController>();
        }
        
        [Fact(DisplayName = nameof(Groups_transactions_by_name_case_insensitive))]
        public async Task Groups_transactions_by_name_case_insensitive()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("Alfa")
                .TheNext(5).WithName("alfa")
            );

            var result = await _controller.GetBy();

            result.Should()
                .NotBeNullOrEmpty().And
                .HaveCount(2);
            result.Select(e => e.Name.ToLower()).Should().OnlyHaveUniqueItems();
        }

        [Fact(DisplayName = nameof(Search_is_case_insesitive))]
        public async Task Search_is_case_insesitive()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("ALFA")
            );


            var result = await _controller.GetBy("alfa");
            result.Should().NotBeNullOrEmpty();
            result.Should().Contain(e => e.Name == "ALFA");
        }

        [Fact(DisplayName = nameof(Search_is_contains_search))]
        public async Task Search_is_contains_search()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("aalfas")
                .TheNext(5).WithName("alfas")
                .TheNext(5).WithName("calfa")
            );


            var result = await _controller.GetBy("alfa");
            result.Should().NotBeNullOrEmpty();
            result.Should().Contain(e => e.Name == "aalfas");
            result.Should().Contain(e => e.Name == "alfas");
            result.Should().Contain(e => e.Name == "calfa");
        }

        [Fact(DisplayName = nameof(In_search_text_space_does_not_considered))]
        public async Task In_search_text_space_does_not_considered()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("alfabeta")
                .TheNext(5).WithName("alfa beta")
            );

            var result = await _controller.GetBy("alfa beta");
            result.Should().NotBeNullOrEmpty();
            result.Should().Contain(e => e.Name == "alfabeta");
            result.Should().Contain(e => e.Name == "alfa beta");
        }

        [Fact(DisplayName = nameof(Search_is_sparse_search))]
        public async Task Search_is_sparse_search()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("xaxlxfxax")
                .TheNext(5).WithName("c a l f a c")
                .TheNext(5).WithName("ccaaalbbffaaa")
            );


            var result = await _controller.GetBy("alfa");
            result.Should().NotBeNullOrEmpty();
            result.Should().Contain(e => e.Name == "xaxlxfxax");
            result.Should().Contain(e => e.Name == "c a l f a c");
            result.Should().Contain(e => e.Name == "ccaaalbbffaaa");
        }

        [Fact(DisplayName = nameof(Returns_with_the_last_Category_value))]
        public async Task Returns_with_the_last_Category_value()
        {
            await _fixture.PrepareDataWith(tr => tr.WithCategoryRandom()
                .TheFirst(4).WithName("alfa1").WithCategory("don't choose").WithCreatedAt("2018.04.14")
                .TheNext(1).WithName("alfa1").WithCategory("right1").WithCreatedAt("2018.04.15")
                .TheNext(4).WithName("alfa2").WithCategory("don't choose").WithCreatedAt("2018.04.14")
                .TheNext(1).WithName("alfa2").WithCategory("right2").WithCreatedAt("2018.04.15")
            );
            var result = await _controller.GetBy("alfa");

            result.Should().NotBeNullOrEmpty();
            result.Should().Contain(e => e.Name == "alfa1")
                .Which.Category.Should().Be("right1");
            result.Should().Contain(e => e.Name == "alfa2")
                .Which.Category.Should().Be("right2");
        }

        [Fact(DisplayName = nameof(Returns_with_the_count_of_occurence_descending_order))]
        public async Task Returns_with_the_count_of_occurence_descending_order()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("alfa3")
                .TheNext(20).WithName("alfa1")
                .TheNext(10).WithName("alfa2")
            );

            var result = await _controller.GetBy("alfa");

            result.Should().HaveCount(3);
            result[0].Occurence.Should().Be(20);
            result[1].Occurence.Should().Be(10);
            result[2].Occurence.Should().Be(5);
        }

        [Fact(DisplayName = nameof(Limits_the_result))]
        public async Task Limits_the_result()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(10).WithName("alfa1")
                .TheNext(9).WithName("alfa2")
                .TheNext(8).WithName("alfa3")
                .TheNext(7).WithName("alfa4")
                .TheNext(6).WithName("alfa5")
                .TheNext(5).WithName("alfa6")
            );

            var result = await _controller.GetBy("alfa", 5);

            result.Should().HaveCount(5);
            result.Should().NotContain(e => e.Name == "alfa6");
        }

        [Fact(DisplayName = nameof(Returns_with_the_most_recent_price))]
        public async Task Returns_with_the_most_recent_price()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(3).WithName("alfa1")
                .TheNext(3).WithName("alfa2")
                .TheFirst(1).WithCreatedAt("2017-10-15").WithValue(2)
                .TheNext(1).WithCreatedAt("2017-10-16").WithValue(1)
                .TheNext(1).WithCreatedAt("2017-10-14").WithValue(3)
                .TheNext(1).WithCreatedAt("2017-10-14").WithValue(2)
                .TheNext(1).WithCreatedAt("2017-10-15").WithValue(1)
                .TheNext(1).WithCreatedAt("2017-10-13").WithValue(3)
            );

            var result = await _controller.GetBy("alfa");

            result.Should().HaveCount(2);
            result.Should().OnlyContain(e => e.LastPrice == 1);
        }

        [Fact(DisplayName = nameof(Returns_with_the_most_recent_wallet))]
        public async Task Returns_with_the_most_recent_wallet()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(3).WithName("alfa1")
                .TheNext(3).WithName("alfa2")
                .TheFirst(1).WithCreatedAt("2017-10-15").WithWallet(_fixture.WalletCash)
                .TheNext(1).WithCreatedAt("2017-10-16").WithWallet(_fixture.WalletBankAccount)
                .TheNext(1).WithCreatedAt("2017-10-14").WithWallet(_fixture.WalletCash)
                .TheNext(1).WithCreatedAt("2017-10-14").WithWallet(_fixture.WalletCash)
                .TheNext(1).WithCreatedAt("2017-10-15").WithWallet(_fixture.WalletBankAccount)
                .TheNext(1).WithCreatedAt("2017-10-13").WithWallet(_fixture.WalletCash)
            );

            var result = await _controller.GetBy("alfa");

            result.Should()
                .HaveCount(2).And
                .OnlyContain(e => e.LastWallet == _fixture.WalletBankAccount.MoneyWalletId);
        }

        [Fact(DisplayName = nameof(Highlights_the_match_in_name))]
        public async Task Highlights_the_match_in_name()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(3).WithName("alfa1")
                .TheNext(3).WithName("2alfa")
                .TheNext(3).WithName("3alfa3")
                .TheNext(3).WithName("xaclafaa")
                .TheNext(3).WithName("xalxfax")
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
