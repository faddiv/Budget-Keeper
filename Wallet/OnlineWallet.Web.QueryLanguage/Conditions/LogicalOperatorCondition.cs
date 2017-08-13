using System.Collections.Generic;
using System.Text;

namespace OnlineWallet.Web.QueryLanguage.Conditions
{
    public class LogicalOperatorCondition : CommonCondition
    {
        #region  Constructors

        public LogicalOperatorCondition(LogicalOperator @operator)
        {
            Operator = @operator;
            Operands = new List<ICondition>();
        }

        #endregion

        #region Properties

        public List<ICondition> Operands { get; }
        public LogicalOperator Operator { get; }

        #endregion

        #region  Nonpublic Methods

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
                ((CommonCondition) Operands[i]).ToStringInternal(builder, false);
            }
            if (addParentheses)
            {
                builder.Append(")");
            }
        }

        #endregion
    }
}