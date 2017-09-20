using FluentAssertions;
using OnlineWallet.Web.QueryLanguage.Sortings;
using Xunit;

namespace OnlineWallet.Web.QueryLanguage
{
    [Trait("ParseSortings", null)]
    public class ParseSortingsTests
    {
        #region Fields

        private readonly QueryLanguageParser _parser = new QueryLanguageParser();

        #endregion

        [Fact(DisplayName = "Parses null and empty as null")]
        public void Parses_null_and_empty_as_null()
        {
            _parser.ParseSortings("").Should().BeNull();
            _parser.ParseSortings(null).Should().BeNull();
        }

        [Fact(DisplayName = "Parses simple property")]
        public void Parses_simple_property()
        {
            Test("Prop1", new Sorting("Prop1", SortDirection.Ascending));
        }

        [Fact(DisplayName = "Parses simple property with direction")]
        public void Parses_simple_property_with_direction()
        {
            Test("Prop1 asc", new Sorting("Prop1", SortDirection.Ascending));
            Test("Prop1 desc", new Sorting("Prop1", SortDirection.Descending));
        }

        [Fact(DisplayName = "Parses multiple property with direction")]
        public void Parses_multiple_property_with_direction()
        {
            Test("Prop1, Prop2 desc", new Sorting("Prop1", SortDirection.Ascending), new Sorting("Prop2", SortDirection.Descending));
            Test("Prop1 desc, Prop2", new Sorting("Prop1", SortDirection.Descending), new Sorting("Prop2", SortDirection.Ascending));
            Test("Prop1 desc, Prop2 asc", new Sorting("Prop1", SortDirection.Descending), new Sorting("Prop2", SortDirection.Ascending));
        }

        private void Test(string input, params Sorting[] sortings)
        {
            var result = _parser.ParseSortings(input);
            result.Should().Equal(sortings);
        }
    }
}