using System;
using FluentAssertions;
using OnlineWallet.Web.QueryLanguage.Conditions;
using Xunit;

namespace OnlineWallet.Web.QueryLanguage
{
    public class QueryLanguageParserTests
    {
        private readonly QueryLanguageParser _parser = new QueryLanguageParser();

        [Fact(DisplayName = "Empty and null string parsed to null")]
        public void EmptyAndNullStringParsedToNull()
        {
            //Act
            _parser.Parse(null).Should().BeNull();
            _parser.Parse(string.Empty).Should().BeNull();
        }

        [Fact(DisplayName = "Parses simple word")]
        public void ParsesSimpleWord()
        {
            //Act
            var condition = _parser.Parse("Valami");
            condition.Should().NotBeNull();
            condition.Should().BeOfType<SearchTermCondition>();
            var term = (SearchTermCondition) condition;
            term.SearchTerm.Should().Be("Valami");
        }

        [Theory(DisplayName = "Parses more word")]
        [InlineData("exp1 exp2", "exp1 And exp2")]
        [InlineData("exp1 exp2 exp3", "exp1 And exp2 And exp3")]
        public void ParsesMoreWord(string searchTerm, string expected)
        {
            //Act
            var condition = _parser.Parse(searchTerm);
            condition.Should().NotBeNull();
            condition.Should().BeOfType<LogicalOperatorCondition>();
            condition.ToString().Should().Be(expected);
        }

        [Theory(DisplayName = "Parses more word connected and operator")]
        [InlineData("exp1 And exp2", "exp1 And exp2")]
        [InlineData("exp1 And exp2 And exp3", "exp1 And exp2 And exp3")]
        [InlineData("exp1 and exp2", "exp1 And exp2")]
        public void ParsesMoreWordConnectedAndOperator(string searchTerm, string expected)
        {
            //Act
            var condition = _parser.Parse(searchTerm);
            condition.Should().NotBeNull();
            condition.Should().BeOfType<LogicalOperatorCondition>();
            condition.ToString().Should().Be(expected);
        }
    }
}
