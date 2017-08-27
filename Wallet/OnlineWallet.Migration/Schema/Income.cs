namespace OnlineWallet.Migration.Schema
{
    public class Income
    {
        public short Year { get; set; }
        public short Month { get; set; }
        public double? Amount { get; set; }
        public MoneySource Source { get; set; }

        public bool ContentEquals(Income item)
        {
            return Source == item.Source
                && Amount.Equals(item.Amount)
                && Year.Equals(item.Year)
                && Month.Equals(item.Month);
        }
        private static bool StringEquals(string str1, string str2)
        {
            return (str1 ?? string.Empty) == (str2 ?? string.Empty);
        }
    }
}