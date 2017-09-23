using System;
using System.Collections.Generic;
using Antlr4.Runtime;
using OnlineWallet.Web.QueryLanguage.Conditions;
using OnlineWallet.Web.QueryLanguage.Parser;
using OnlineWallet.Web.QueryLanguage.Sortings;
using OnlineWallet.Web.QueryLanguage.Visitors;

namespace OnlineWallet.Web.QueryLanguage
{
    public class QueryLanguageParser
    {
        #region  Public Methods

        public static ICondition ParseFilter(string input)
        {
            if (string.IsNullOrEmpty(input)) return null;
            var antlrInputStream = new AntlrInputStream(input);
            var lex = new FilterLexer(antlrInputStream);
            lex.AddErrorListener(new StopOnErrorListener());
            var cts = new CommonTokenStream(lex);
            //PrintTokens(cts);
            var parse = new FilterParser(cts)
            {
                ErrorHandler = new BailErrorStrategy()
            };
            parse.AddErrorListener(new StopOnErrorListener());
            var root = parse.primary();
            var visitor = new ConditionVisitor();
            var condition = visitor.Visit(root);
            return condition;
        }

        public static List<Sorting> ParseSortings(string input)
        {
            if (string.IsNullOrEmpty(input)) return null;
            var sortingStrings = input.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            var sortings = new List<Sorting>();
            foreach (var sortingString in sortingStrings)
            {
                var propAndDirection = sortingString.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                if (propAndDirection.Length == 2)
                {
                    sortings.Add(new Sorting(propAndDirection[0], ToDirection(propAndDirection[1])));
                }
                else if (propAndDirection.Length == 1)
                {
                    sortings.Add(new Sorting(propAndDirection[0], SortDirection.Ascending));
                }
                else
                {
                    throw new ParserException($"invalid sorting: {sortingString}", null);
                }
            }
            return sortings;
        }

        private static SortDirection ToDirection(string directionString)
        {
            switch (directionString.ToLower())
            {
                case "asc":
                    return SortDirection.Ascending;
                case "desc":
                    return SortDirection.Descending;
                default:
                    throw new ParserException($"Invalid direction: {directionString}", null);
            }
        }

        #endregion
    }
}