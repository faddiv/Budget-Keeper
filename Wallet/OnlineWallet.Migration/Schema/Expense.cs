using System;

namespace OnlineWallet.Migration.Schema
{
    public class Expense
    {
        public Expense()
        {
            Created = DateTime.Today;
        }
        public DateTime Created { get; set; }
        public string Name { get; set; }
        public string Comment { get; set; }
        public string Category { get; set; }
        public double? Amount { get; set; }
        public MoneySource Source { get; set; }

        public bool ContentEquals(Expense other)
        {
            return Created.Equals(other.Created)
                && StringEquals(Name, other.Name)
                && StringEquals(Comment, other.Comment)
                && StringEquals(Category, other.Category)
                && Amount.Equals(other.Amount)
                && Source == other.Source;
        }

        private static bool StringEquals(string str1, string str2)
        {
            return (str1 ?? string.Empty) == (str2 ?? string.Empty);
        }
    }
}