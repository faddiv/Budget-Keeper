using System;
using System.Linq.Expressions;
using OnlineWallet.Web.QueryLanguage.Conditions;

namespace OnlineWallet.Web.Common.Queries
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
            if (condition is ComparisonCondition comparisonCondition)
            {
                return VisitComparisonCondition(comparisonCondition, par);
            }
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

        protected Expression VisitComparisonCondition(ComparisonCondition comparison, ParameterExpression par)
        {
            var field = comparison.Field as FieldCondition ?? comparison.Literal as FieldCondition;
            if (field == null) throw new Exception($"No field in expression: {comparison}");
            var property = par.Type.GetProperty(field.FieldName);
            if(property == null) throw new Exception($"Unknown field: {field}");
            var literal = comparison.Field as SearchTermCondition ?? comparison.Literal as SearchTermCondition;
            if (literal == null) throw new Exception($"No literal in expression: {comparison}");
            var propertyGetter = Expression.MakeMemberAccess(par, property);
            object value = literal.SearchTerm;
            if(propertyGetter.Type != typeof(string))
            {
                value = Convert.ChangeType(value, propertyGetter.Type);
            }
            var valueExpr = Expression.Constant(value);
            switch (comparison.Operator)
            {
                case ComparisonOperator.Equal:
                    return Expression.Equal(propertyGetter, valueExpr);
                    break;
                case ComparisonOperator.NotEqual:
                    return Expression.NotEqual(propertyGetter, valueExpr);
                    break;
                case ComparisonOperator.GreaterThan:
                    return Expression.GreaterThan(propertyGetter, valueExpr);
                    break;
                case ComparisonOperator.LessThan:
                    return Expression.LessThan(propertyGetter, valueExpr);
                    break;
                case ComparisonOperator.GreaterOrEqual:
                    return Expression.GreaterThanOrEqual(propertyGetter, valueExpr);
                    break;
                case ComparisonOperator.LessOrEqual:
                    return Expression.LessThanOrEqual(propertyGetter, valueExpr);
                    break;
                default:
                    throw new Exception($"Unknown comparison in expression: {comparison}");
                    break;
            }
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