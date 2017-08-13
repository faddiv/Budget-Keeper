using System;
using System.Linq.Expressions;

namespace OnlineWallet.Web.Services
{
    public class ReplaceParameter : ExpressionVisitor
    {
        private readonly ParameterExpression _source;
        private readonly ParameterExpression _target;

        public ReplaceParameter(ParameterExpression source, ParameterExpression target)
        {
            _source = source;
            _target = target;
        }

        protected override Expression VisitParameter(ParameterExpression node)
        {
            if (Object.Equals(_source, node))
            {
                return _target;
            }
            return base.VisitParameter(node);
        }
    }
}