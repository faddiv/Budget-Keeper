using FluentAssertions;
using Xunit;

namespace OnlineWallet.Web.Common.Helpers
{
    [Trait("StringExtensions", "SplitWithoutEmptyEntries")]
    public class StringExtensionsSplitWithoutEmptyEntriesTests
    {
        [Fact(DisplayName = "Splits text and remove empty entries")]
        public void Splits_Text_And_Remove_Empty_Entries()
        {
            var result = "alfa beta  gamma".SplitWithoutEmptyEntries(' ');

            result.Should().NotBeNull();
            result.Should().HaveCount(3);
            result.Should().ContainInOrder(new[] { "alfa", "beta", "gamma" });
        }
    }
}