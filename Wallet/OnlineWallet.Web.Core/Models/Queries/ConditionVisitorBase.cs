using System;
using System.Linq.Expressions;
using OnlineWallet.Web.QueryLanguage.Conditions;
using OnlineWallet.Web.Services;

namespace OnlineWallet.Web.Models.Queries
{
    public abstract class ConditionVisitorBase<T>
    {
        #region  Public Methods

        public Expression<Func<T, bool>> Visit(ICondition condition)
        {
            var par = Expression.Parameter(typeof(T));
            return Expression.Lambda<Func<T, bool>>(VisitInternal(condition, par), par);
        }

        #endregion

        #region  Nonpublic Methods

        protected Expression VisitInternal(ICondition condition, ParameterExpression par)
        {
            if (condition == null)
                return null;
            if (condition is SearchTermCondition searchTermCondition)
            {
                return VisitSearchTermConditionCore(searchTermCondition, par);
            }
            if (condition is LogicalOperatorCondition logicalOperatorCondition)
            {
                return VisitLogicalOperatorCondition(logicalOperatorCondition, par);
            }
            throw new Exception();
        }

        protected virtual Expression VisitLogicalOperatorCondition(LogicalOperatorCondition condition,
            ParameterExpression par)
        {
            if (condition.Operands.Count == 0) throw new Exception();
            Expression expr = VisitInternal(condition.Operands[0], par);
            for (int i = 1; i < condition.Operands.Count; i++)
            {
                switch (condition.Operator)
                {
                    case LogicalOperator.And:
                        expr = Expression.AndAlso(expr, VisitInternal(condition.Operands[i], par));
                        break;
                    case LogicalOperator.Or:
                        expr = Expression.OrElse(expr, VisitInternal(condition.Operands[i], par));
                        break;
                    default:
                        throw new Exception();
                }
            }
            return expr;
        }

        protected abstract Expression<Func<T, bool>> VisitSearchTermCondition(SearchTermCondition condition);

        private Expression VisitSearchTermConditionCore(SearchTermCondition condition, ParameterExpression par)
        {
            var searchTerm = VisitSearchTermCondition(condition);
            var replacer = new ReplaceParameter(searchTerm.Parameters[0], par);
            var body = replacer.Visit(searchTerm.Body);
            return body;
        }

        #endregion
    }
}