using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlineWallet.Web.Common.Helpers
{
    public static class StringExtensions
    {
        public static string[] SplitWithoutEmptyEntries(this string text, params char[] ch)
        {
            return text.Split(ch, StringSplitOptions.RemoveEmptyEntries);
        }

        public static string FillWith(this string text, char ch)
        {
            var builder = new StringBuilder(text.Length * 2 + 1);
            builder.Append(ch);
            foreach (var tch in text)
            {
                builder.Append(tch).Append(ch);
            }
            return builder.ToString();
        }

        public static string Highlight(string input, string start, string end, string search)
        {
            int index = 0;
            var builder = new StringBuilder();
            var closed = true;
            foreach (var ch in input)
            {
                if(index < search.Length && char.ToLower(ch) == char.ToLower(search[index]))
                {
                    if(closed)
                    {
                        builder.Append(start);
                        closed = false;
                    }
                    index++;
                } else if(!closed)
                {
                    builder.Append(end);
                    closed = true;
                }
                builder.Append(ch);
            }
            if (!closed)
            {
                builder.Append(end);
            }
            return builder.ToString();
        }
    }
}
