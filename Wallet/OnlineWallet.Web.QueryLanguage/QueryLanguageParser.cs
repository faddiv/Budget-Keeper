using System;
using Antlr4.Runtime;
using OnlineWallet.Web.QueryLanguage.Conditions;
using OnlineWallet.Web.QueryLanguage.Parser;
using OnlineWallet.Web.QueryLanguage.Visitors;

namespace OnlineWallet.Web.QueryLanguage
{
    public class QueryLanguageParser
    {
        public ICondition Parse(string input)
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
    }
}
