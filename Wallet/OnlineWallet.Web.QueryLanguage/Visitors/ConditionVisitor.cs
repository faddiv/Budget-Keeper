using System;
using System.Collections.Generic;
using System.Text;
using OnlineWallet.Web.QueryLanguage.Conditions;
using OnlineWallet.Web.QueryLanguage.Parser;

namespace OnlineWallet.Web.QueryLanguage.Visitors
{
    class ConditionVisitor : FilterParserBaseVisitor<ICondition>
    {

        public override ICondition VisitFilter(FilterParser.FilterContext context)
        {
            var visitFilter = base.VisitFilter(context);
            return visitFilter;
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

        public override ICondition VisitAndTerm(FilterParser.AndTermContext context)
        {
            var childTerms = context.orTerm();
            if (childTerms.Length == 1)
                return Visit(childTerms[0]);
            var andCondition = new LogicalOperatorCondition(LogicalOperator.And);
            foreach (var term in childTerms)
            {
                andCondition.Operands.Add(Visit(term));
            }
            return andCondition;
        }

        public override ICondition VisitOrTerm(FilterParser.OrTermContext context)
        {
            var childTerms = context.searchTerm();
            if (childTerms.Length == 1)
                return Visit(childTerms[0]);
            var andCondition = new LogicalOperatorCondition(LogicalOperator.Or);
            foreach (var term in childTerms)
            {
                andCondition.Operands.Add(Visit(term));
            }
            return andCondition;
        }


        public override ICondition VisitSearchTerm(FilterParser.SearchTermContext context)
        {
            var text = context.GetText();
            var condition = new SearchTermCondition(text);
            return condition;
        }
    }
}
