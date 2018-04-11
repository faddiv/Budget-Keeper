using FluentAssertions;
using Xunit;

namespace OnlineWallet.Web.Common.Helpers
{
    [Trait(nameof(StringExtensions), nameof(StringExtensions.FillWith))]
    public class StringExtensionsFillWith
    {
        [Fact(DisplayName = nameof(Fills_the_text_with_given_char_between_every_char_and_at_the_begin_and_end))]
        public void Fills_the_text_with_given_char_between_every_char_and_at_the_begin_and_end()
        {
            var result = "gamma".FillWith('%');

            result.Should().Be("%g%a%m%m%a%");
        }
    }
}