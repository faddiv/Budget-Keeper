using System.Text;

namespace OnlineWallet.Web.QueryLanguage.Conditions
{
    public abstract class CommonCondition : ICondition
    {
        #region  Public Methods

        public override string ToString()
        {
            var builder = new StringBuilder();
            ToStringInternal(builder, true);
            return builder.ToString();
        }

        #endregion

        #region  Nonpublic Methods

        internal abstract void ToStringInternal(StringBuilder builder, bool topLevel);

        #endregion
    }
}