using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using OnlineWallet.Web.TestHelpers;
using OnlineWallet.Web.TestHelpers.Builders;
using TestStack.Dossier.Lists;
using Xunit;

namespace OnlineWallet.Web.Modules.GeneralDataModule.Queries
{
    [Trait(nameof(Queries.ArticleQueries), nameof(Queries.ArticleQueries.SearchByText))]
    [Collection("Database collection")]
    public class ArticleQueriesSearchByTextTests : ArticleQueriesTests
    {
        public ArticleQueriesSearchByTextTests(DatabaseFixture fixture)
            : base(fixture)
        {
            var articleBuilder = new ArticleBuilder();
            Fixture.DbContext.Article.Add(articleBuilder.WithName(ArticleName).Build());
            Fixture.DbContext.SaveChanges();
        }
        
        [Fact(DisplayName = nameof(Search_is_case_insesitive))]
        public async Task Search_is_case_insesitive()
        {
            await Fixture.PrepareArticlesWith(tr => tr
                .TheFirst(1).WithName("Alfa")
                .TheNext(1).WithName("alfa")
            );


            var result = await ArticleQueries.SearchByText("alfa", 10, CancellationToken.None);
            result.Should().NotBeNullOrEmpty();
            result.Should().Contain(e => e.Name == "alfa");
            result.Should().Contain(e => e.Name == "Alfa");
        }

        [Fact(DisplayName = nameof(Search_is_contains_search))]
        public async Task Search_is_contains_search()
        {
            await Fixture.PrepareArticlesWith(tr => tr
                .TheFirst(1).WithName("aAlfas")
                .TheNext(1).WithName("calfas")
            );


            var result = await ArticleQueries.SearchByText("alfa", 10, CancellationToken.None);
            result.Should().NotBeNullOrEmpty();
            result.Should().OnlyContain(e => e.Name.ToLower().Contains("alfa"));
        }

        [Fact(DisplayName = nameof(In_search_text_space_does_not_considered))]
        public async Task In_search_text_space_does_not_considered()
        {
            await Fixture.PrepareArticlesWith(tr => tr
                .TheFirst(1).WithName("Alfa")
                .TheNext(1).WithName("Alfa Beta")
                .TheNext(1).WithName("alfa       beta")
                .TheFirst(1).WithName("Beta")
                .TheNext(1).WithName("beta alfa")
            );

            var result = await ArticleQueries.SearchByText("alfa beta", 10, CancellationToken.None);
            result.Should().NotBeNullOrEmpty();
            result.Should().OnlyContain(e => e.Name.ToLower().Contains("alfa"));
            result.Should().OnlyContain(e => e.Name.ToLower().Contains("beta"));
        }

        [Fact(DisplayName = nameof(Search_is_sparse_search))]
        public async Task Search_is_sparse_search()
        {
            await Fixture.PrepareArticlesWith(tr => tr
                .TheFirst(1).WithName("xaxlxfxax")
                .TheNext(1).WithName("xAxLxFxAx")
                .TheNext(1).WithName(" A L F A ")
                .TheNext(1).WithName("AFLA")
            );


            var result = await ArticleQueries.SearchByText("alfa", 10, CancellationToken.None);
            result.Should().NotBeNullOrEmpty();
            result.Should().OnlyContain(e => e.Name.IsMatch(@".*a.*l.*f.*a.*"));
        }
        
        [Fact(DisplayName = nameof(Returns_with_the_count_of_occurence_descending_order))]
        public async Task Returns_with_the_count_of_occurence_descending_order()
        {
            await Fixture.PrepareArticlesWith(tr => tr
                .TheFirst(1).WithName("alfa11").WithOccurence(5)
                .TheNext(1).WithName("alfa22").WithOccurence(20)
                .TheNext(1).WithName("alfa33").WithOccurence(10)
            );

            var result = await ArticleQueries.SearchByText("alfa", 10, CancellationToken.None);

            result.Should()
                .HaveCount(3);
            result[0].Occurence.Should().Be(20);
            result[1].Occurence.Should().Be(10);
            result[2].Occurence.Should().Be(5);
        }

        [Fact(DisplayName = nameof(Limits_the_result))]
        public async Task Limits_the_result()
        {
            await Fixture.PrepareArticlesWith(tr => tr
                .TheFirst(1).WithName("alfa2").WithOccurence(5)
                .TheNext(1).WithName("alfa4").WithOccurence(3)
                .TheNext(1).WithName("alfa5").WithOccurence(2)
                .TheNext(1).WithName("alfa1").WithOccurence(6)
                .TheNext(1).WithName("alfa6").WithOccurence(1)
                .TheNext(1).WithName("alfa3").WithOccurence(4)
            );

            var result = await ArticleQueries.SearchByText("alfa", 5, CancellationToken.None);

            result.Should().HaveCount(5);
            result.Should().NotContain(e => e.Name == "alfa6");
        }
        
        [Fact(DisplayName = nameof(Highlights_the_match_in_name))]
        public async Task Highlights_the_match_in_name()
        {
            await Fixture.PrepareArticlesWith(tr => tr
                .TheFirst(1).WithName("alfa11")
                .TheNext(1).WithName("2alfa")
                .TheNext(1).WithName("3alfa3")
                .TheNext(1).WithName("xaclafaa")
                .TheNext(1).WithName("xalxfax")
            );

            var result = await ArticleQueries.SearchByText("alfa", 10, CancellationToken.None);

            result.Should().HaveCount(5);
            result.Should().Contain(e => e.NameHighlighted == "<strong>alfa</strong>11");
            result.Should().Contain(e => e.NameHighlighted == "2<strong>alfa</strong>");
            result.Should().Contain(e => e.NameHighlighted == "3<strong>alfa</strong>3");
            result.Should().Contain(e => e.NameHighlighted == "x<strong>al</strong>x<strong>fa</strong>x");
        }
    }
}
