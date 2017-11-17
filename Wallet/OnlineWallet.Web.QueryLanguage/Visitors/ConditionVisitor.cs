using Antlr4.Runtime.Misc;
using OnlineWallet.Web.QueryLanguage.Conditions;
using OnlineWallet.Web.QueryLanguage.Parser;

namespace OnlineWallet.Web.QueryLanguage.Visitors
{
    internal class ConditionVisitor : FilterParserBaseVisitor<ICondition>
    {
        #region  Public Methods

        public override ICondition VisitAndTerm(FilterParser.AndTermContext context)
        {
            var childTerms = context.orTerm();
            if (childTerms.Length == 1)
                return Visit(childTerms[0]);
            var condition = new LogicalOperatorCondition(LogicalOperator.And);
            foreach (var term in childTerms)
            {
                condition.Operands.Add(Visit(term));
            }
            return condition;
        }

        public override ICondition VisitFilter(FilterParser.FilterContext context)
        {
            var visitFilter = base.VisitFilter(context);
            return visitFilter;
        }

        public override ICondition VisitOrTerm(FilterParser.OrTermContext context)
        {
            var childTerms = context.comparison();
            if (childTerms.Length == 1)
                return Visit(childTerms[0]);
            var condition = new LogicalOperatorCondition(LogicalOperator.Or);
            foreach (var term in childTerms)
            {
                condition.Operands.Add(Visit(term));
            }
            return condition;
        }

        public override ICondition VisitPrimary(FilterParser.PrimaryContext context)
        {
            var childTerms = context.andTerm();
            if (childTerms.Length == 1)
                return Visit(childTerms[0]);
            var andCondition = new LogicalOperatorCondition(LogicalOperator.And);
            foreach (var term in childTerms)
            {
                andCondition.Operands.Add(Visit(term));
            }
            return andCondition;
        }

        public override ICondition VisitComparison(FilterParser.ComparisonContext context)
        {
            ICondition condition;
            var searchTerms = context.atomic();
            if (searchTerms.Length == 1)
            {
                condition = Visit(searchTerms[0]);
                if (condition is FieldCondition field)
                {
                    condition = new SearchTermCondition(field.FieldName);
                }
            }
            else
            {
                var field = Visit(searchTerms[0]) as AtomicCondition;
                var literal = Visit(searchTerms[1]) as AtomicCondition;
                var text = context.COMPARISON().GetText();
                switch (text)
                {
                    case "<":
                        condition = new ComparisonCondition(field,
                            ComparisonOperator.LessThan, literal);
                        break;
                    case ">":
                        condition = new ComparisonCondition(field,
                            ComparisonOperator.GreaterThan, literal);
                        break;
                    case ">=":
                        condition = new ComparisonCondition(field,
                            ComparisonOperator.GreaterOrEqual, literal);
                        break;
                    case "<=":
                        condition = new ComparisonCondition(field,
                            ComparisonOperator.LessOrEqual, literal);
                        break;
                    case "==":
                        condition = new ComparisonCondition(field,
                            ComparisonOperator.Equal, literal);
                        break;
                    case "!=":
                        condition = new ComparisonCondition(field,
                            ComparisonOperator.NotEqual, literal);
                        break;
                    default:
                        throw new ParserException($"Unknown comparison: {text}", null);
                }
            }
            return condition;
        }
        public override ICondition VisitAtomic([NotNull] FilterParser.AtomicContext context)
        {
            var str = context.STRING();
            if (str != null)
            {
                var text = str.GetText();
                return new SearchTermCondition(text.Substring(1, text.Length - 2));
            }
            var wrd = context.WORD();
            if (wrd != null)
                return new FieldCondition(wrd.GetText());
            throw new ParserException($"Unknown tree part: {context.GetText()}", null);
        }

        #endregion
    }
}