using System.Collections.Generic;

namespace OnlineWallet.Web.QueryLanguage.Conditions
{
    public class LogicalOperatorCondition : ICondition
    {
        public LogicalOperatorCondition(LogicalOperator @operator)
        {
            Operator = @operator;
            Operands = new List<ICondition>();
        }
        public LogicalOperator Operator { get; }

        public List<ICondition> Operands { get; }

        public override string ToString()
        {
            return string.Join($" {Operator} ", Operands);
        }
    }
}