using System;

namespace OnlineWallet.Web.QueryLanguage
{
    public class ParserException : Exception
    {
        #region  Constructors

        public ParserException(FormattableString message, Exception recognitionException)
            : base(message.ToString(), recognitionException)
        {
        }

        #endregion
    }
}