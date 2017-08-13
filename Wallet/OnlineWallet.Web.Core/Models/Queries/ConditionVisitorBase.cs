using System;
using System.Linq.Expressions;
using OnlineWallet.Web.QueryLanguage.Conditions;
using OnlineWallet.Web.Services;

namespace OnlineWallet.Web.Models.Queries
{
    public abstract class ConditionVisitorBase<T>
    {
        public Expression<Func<T, bool>> Visit(ICondition condition)
        {
            var par = Expression.Parameter(typeof(T));
            return Expression.Lambda<Func<T, bool>>(VisitInternal(condition, par), par);
        }

        protected Expression VisitInternal(ICondition condition, ParameterExpression par)
        {
            if (condition == null)
                return null;
            var searchTermCondition = condition as SearchTermCondition;
            if (searchTermCondition != null)
            {
                return VisitSearchTermConditionCore(searchTermCondition, par);
            }
            var logicalOperatorCondition = condition as LogicalOperatorCondition;
            if (logicalOperatorCondition != null)
            {
                return VisitLogicalOperatorCondition(logicalOperatorCondition, par);
            }
            throw new Exception();
        }

        protected virtual Expression VisitLogicalOperatorCondition(LogicalOperatorCondition condition, ParameterExpression par)
        {
            if (condition.Operands.Count == 0) throw new Exception();
            Expression expr = VisitInternal(condition.Operands[0], par);
            for (int i = 1; i < condition.Operands.Count; i++)
            {
                if (condition.Operator == LogicalOperator.And)
                {
                    expr = Expression.AndAlso(expr, VisitInternal(condition.Operands[i], par));
                } else
                {
                    expr = Expression.OrElse(expr, VisitInternal(condition.Operands[i], par));
                }
            }
            return expr;
        }

        private Expression VisitSearchTermConditionCore(SearchTermCondition condition, ParameterExpression par)
        {
            var searchTerm = VisitSearchTermCondition(condition);
            var replacer = new ReplaceParameter(searchTerm.Parameters[0], par);
            var body = replacer.Visit(searchTerm.Body);
            return body;
        }
        protected abstract Expression<Func<T, bool>> VisitSearchTermCondition(SearchTermCondition condition);
    }
}