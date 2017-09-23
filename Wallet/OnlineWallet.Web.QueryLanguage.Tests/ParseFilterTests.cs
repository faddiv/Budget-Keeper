using FluentAssertions;
using OnlineWallet.Web.QueryLanguage.Conditions;
using Xunit;

namespace OnlineWallet.Web.QueryLanguage
{
    [Trait("ParseFilter", null)]
    public class ParseFilterTests
    {
        #region  Public Methods

        [Theory(DisplayName = "Can combine And and Or with right precedence")]
        [InlineData("exp1 Or exp2 And exp3 Or exp4", "(exp1 Or exp2) And (exp3 Or exp4)")]
        [InlineData("exp1 Or exp2 And exp3", "(exp1 Or exp2) And exp3")]
        [InlineData("exp1 And exp3 Or exp4", "exp1 And (exp3 Or exp4)")]
        [InlineData("exp1 Or exp2", "exp1 Or exp2")]
        public void CanCombineAndAndOrWithRightPrecedence(string searchTerm, string expected)
        {
            //Act
            var condition = QueryLanguageParser.ParseFilter(searchTerm);
            condition.Should().NotBeNull();
            condition.Should().BeOfType<LogicalOperatorCondition>();
            condition.ToString().Should().Be(expected);
        }

        [Fact(DisplayName = "Empty and null string parsed to null")]
        public void EmptyAndNullStringParsedToNull()
        {
            //Act
            QueryLanguageParser.ParseFilter(null).Should().BeNull();
            QueryLanguageParser.ParseFilter(string.Empty).Should().BeNull();
        }

        [Theory(DisplayName = "Parses more word")]
        [InlineData("exp1 exp2", "exp1 And exp2")]
        [InlineData("exp1 exp2 exp3", "exp1 And exp2 And exp3")]
        public void ParsesMoreWord(string searchTerm, string expected)
        {
            //Act
            var condition = QueryLanguageParser.ParseFilter(searchTerm);
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
            var condition = QueryLanguageParser.ParseFilter(searchTerm);
            condition.Should().NotBeNull();
            condition.Should().BeOfType<LogicalOperatorCondition>();
            condition.ToString().Should().Be(expected);
        }

        [Theory(DisplayName = "Parses more word connected or operator")]
        [InlineData("exp1 Or exp2", "exp1 Or exp2")]
        [InlineData("exp1 Or exp2 Or exp3", "exp1 Or exp2 Or exp3")]
        [InlineData("exp1 or exp2", "exp1 Or exp2")]
        public void ParsesMoreWordConnectedOrOperator(string searchTerm, string expected)
        {
            //Act
            var condition = QueryLanguageParser.ParseFilter(searchTerm);
            condition.Should().NotBeNull();
            condition.Should().BeOfType<LogicalOperatorCondition>();
            condition.ToString().Should().Be(expected);
        }

        [Fact(DisplayName = "Parses simple word")]
        public void ParsesSimpleWord()
        {
            //Act
            var condition = QueryLanguageParser.ParseFilter("Valami");
            condition.Should().NotBeNull();
            condition.Should().BeOfType<SearchTermCondition>();
            var term = (SearchTermCondition) condition;
            term.SearchTerm.Should().Be("Valami");
        }

        #endregion
    }
}