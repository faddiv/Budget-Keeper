using System;
using System.Text.RegularExpressions;

namespace OnlineWallet.Web.TestHelpers
{
    public static class TestExtensions
    {
        #region  Public Methods

        public static bool EqualTo(this DateTime dateTime, string dateTimeString)
        {
            return dateTime == DateTime.Parse(dateTimeString);
        }

        public static bool GreaterOrEqualTo(this DateTime dateTime, string dateTimeString)
        {
            return dateTime >= DateTime.Parse(dateTimeString);
        }

        public static bool LessOrEqualTo(this DateTime dateTime, string dateTimeString)
        {
            return dateTime <= DateTime.Parse(dateTimeString);
        }

        public static bool IsMatch(this string input, string pattern)
        {
            return Regex.IsMatch(input, pattern, RegexOptions.IgnoreCase);
        }

        public static bool IsMatch(this string input, string pattern, RegexOptions options)
        {
            return Regex.IsMatch(input, pattern, options);
        }
        
        #endregion
    }
}