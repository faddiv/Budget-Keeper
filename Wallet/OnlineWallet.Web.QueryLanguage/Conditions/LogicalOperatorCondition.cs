using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OnlineWallet.Web.QueryLanguage.Conditions
{
    public class LogicalOperatorCondition : CommonCondition
    {
        public LogicalOperatorCondition(LogicalOperator @operator)
        {
            Operator = @operator;
            Operands = new List<ICondition>();
        }
        public LogicalOperator Operator { get; }

        public List<ICondition> Operands { get; }

        internal override void ToStringInternal(StringBuilder builder, bool topLevel)
        {
            var addParentheses = Operator == LogicalOperator.Or && !topLevel && Operands.Count > 1;
            if (addParentheses)
            {
                builder.Append("(");
            }
            for (int i = 0; i < Operands.Count; i++)
            {
                if (i > 0)
                {
                    builder.Append(' ').Append(Operator).Append(' ');
                }
                ((CommonCondition)Operands[i]).ToStringInternal(builder, false);
            }
            if (addParentheses)
            {
                builder.Append(")");
            }
        }
    }
}