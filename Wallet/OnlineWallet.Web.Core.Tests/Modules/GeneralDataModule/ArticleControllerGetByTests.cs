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
    [Collection("Database collection")]
    public class ArticleControllerGetByTests : IDisposable
    {
        private readonly ServicesFixture _fixture;
        private readonly ArticleController _controller;

        public ArticleControllerGetByTests(DatabaseFixture fixture)
        {
            _fixture = fixture.CreateServiceFixture();
            _controller = _fixture.GetService<ArticleController>();
        }

        public void Dispose()
        {
            _fixture.Cleanup();
        }

        [Fact(DisplayName = nameof(Groups_transactions_by_name_case_sensitive))]
        public async Task Groups_transactions_by_name_case_sensitive()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("Alfa")
                .TheNext(5).WithName("alfa")
            );

            var result = await _controller.GetBy();

            result.Should()
                .NotBeNullOrEmpty().And
                .HaveCount(3);
            result.Select(e => e.Name).Should().OnlyHaveUniqueItems();
        }

        [Fact(DisplayName = nameof(Search_is_case_insesitive))]
        public async Task Search_is_case_insesitive()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("Alfa")
                .TheNext(5).WithName("alfa")
            );
            

            var result = await _controller.GetBy("alfa");
            result.Should()
                .NotBeNullOrEmpty().And
                .OnlyContain(e => e.Name.ToLower().Contains("alfa"));
        }

        [Fact(DisplayName = nameof(Search_is_contains_search))]
        public async Task Search_is_contains_search()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("aAlfas")
                .TheNext(5).WithName("calfas")
            );


            var result = await _controller.GetBy("alfa");
            result.Should()
                .NotBeNullOrEmpty().And
                .OnlyContain(e => e.Name.ToLower().Contains("alfa"));
        }

        [Fact(DisplayName = nameof(In_search_text_space_does_not_considered))]
        public async Task In_search_text_space_does_not_considered()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("Alfa")
                .TheNext(5).WithName("Alfa Beta")
                .TheNext(5).WithName("alfa beta")
                .TheFirst(5).WithName("Beta")
                .TheNext(5).WithName("beta alfa")
            );

            var result = await _controller.GetBy("alfa beta");
            result.Should()
                .NotBeNullOrEmpty().And
                .OnlyContain(e => e.Name.ToLower().Contains("alfa")).And
                .OnlyContain(e => e.Name.ToLower().Contains("beta"));
        }

        [Fact(DisplayName = nameof(Search_is_sparse_search))]
        public async Task Search_is_sparse_search()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("xaxlxfxax")
                .TheNext(5).WithName("xAxLxFxAx")
            );


            var result = await _controller.GetBy("alfa");
            result.Should()
                .NotBeNullOrEmpty().And
                .OnlyContain(e => e.Name.ToLower().Contains("xaxlxfxax"));
        }
        
        [Fact(DisplayName = nameof(Returns_with_the_most_common_Category_value))]
        public async Task Returns_with_the_most_common_Category_value()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("alfa").WithCategory("not common")
                .TheNext(20).WithName("alfa").WithCategory("most common")
                .TheNext(10).WithName("alfa").WithCategory("second common")
            );

            var result = await _controller.GetBy("alfa");

            result.Should()
                .NotBeNullOrEmpty().And
                .OnlyContain(e => e.Category == "most common");
        }

        [Fact(DisplayName = nameof(Most_common_category_cant_be_null_if_there_is_one))]
        public async Task Most_common_category_cant_be_null_if_there_is_one()
        {
            await _fixture.PrepareDataWith(tr => tr
                .TheFirst(5).WithName("alfa").WithCategory("not common")
                .TheNext(20).WithName("alfa").WithCategory(null)
                .TheNext(10).WithName("alfa").WithCategory("most common")
            );

            var result = await _controller.GetBy("alfa");

            result.Should()
                .NotBeNullOrEmpty().And
                .OnlyContain(e => e.Category == "most common");
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

            result.Should()
                .HaveCount(3);
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

            result.Should()
                .HaveCount(5);
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

            result.Should()
                .HaveCount(2).And
                .OnlyContain(e => e.LastPrice == 1);
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
