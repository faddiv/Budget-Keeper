using System;

namespace OnlineWallet.Migration
{
    public static class MathExtensions
    {
        public static double Round(this double value, MidpointRounding rounding = MidpointRounding.AwayFromZero)
        {
            return Math.Round(value, rounding);
        }

        public static int CastInt(this double value)
        {
            return (int) value;
        }
    }
}
