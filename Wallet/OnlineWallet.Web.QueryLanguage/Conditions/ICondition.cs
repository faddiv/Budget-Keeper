using System.Text;

namespace OnlineWallet.Web.QueryLanguage.Conditions
{
    public interface ICondition
    {
    }

    public abstract class CommonCondition : ICondition
    {
        public override string ToString()
        {
            var builder = new StringBuilder();
            ToStringInternal(builder, true);
            return builder.ToString();
        }

        internal abstract void ToStringInternal(StringBuilder builder, bool topLevel);
    }
}