using FluentAssertions;
using Xunit;

namespace OnlineWallet.Web.Common.Helpers
{
    [Trait("StringExtensions", "Highlight")]
    public class StringExtensionsHighlight
    {
        [Fact(DisplayName = "Decorates_matching_characters_with_highlight_boundaries")]
        public void Decorates_matching_characters_with_highlight_boundaries()
        {
            var result = StringExtensions.Highlight("xgxax", "<strong>", "</strong>", "ga");

            result.Should().Be("x<strong>g</strong>x<strong>a</strong>x");
        }
        
        [Fact(DisplayName = "Decorates_matching_groups_together")]
        public void Decorates_matching_groups_together()
        {
            var result = StringExtensions.Highlight("xgaxcfx", "<strong>", "</strong>", "gacf");

            result.Should().Be("x<strong>ga</strong>x<strong>cf</strong>x");
        }

        [Fact(DisplayName = "Decorates_only_the_first_occurence")]
        public void Decorates_only_the_first_occurence()
        {
            var result = StringExtensions.Highlight("xgagaxcfx", "<strong>", "</strong>", "gacf");

            result.Should().Be("x<strong>ga</strong>gax<strong>cf</strong>x");

            result = StringExtensions.Highlight("xgxgaxcfx", "<strong>", "</strong>", "gacf");

            result.Should().Be("x<strong>g</strong>xg<strong>a</strong>x<strong>cf</strong>x");
        }

        [Fact(DisplayName = "Decorates_at_beginning")]
        public void Decorates_at_beginning()
        {
            var result = StringExtensions.Highlight("gaxxx", "<strong>", "</strong>", "ga");

            result.Should().Be("<strong>ga</strong>xxx");
        }

        [Fact(DisplayName = "Decorates_at_end")]
        public void Decorates_at_end()
        {
            var result = StringExtensions.Highlight("xxxga", "<strong>", "</strong>", "ga");

            result.Should().Be("xxx<strong>ga</strong>");
        }
    }
}