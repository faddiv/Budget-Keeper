using System;

namespace OnlineWallet.ExportImport
{
    public class ExportImportRow
    {
        public ExportImportRow()
        {
            Created = DateTime.Today;
        }
        public DateTime Created { get; set; }
        public string Name { get; set; }
        public string Comment { get; set; }
        public string Category { get; set; }
        public int? Amount { get; set; }
        public MoneySource Source { get; set; }
        public MoneyDirection Direction { get; set; }

        public bool ContentEquals(ExportImportRow other)
        {
            return Created.Equals(other.Created)
                && StringEquals(Name, other.Name)
                && StringEquals(Comment, other.Comment)
                && StringEquals(Category, other.Category)
                && Amount.Equals(other.Amount)
                && Direction.Equals(other.Direction)
                && Source == other.Source;
        }

        private static bool StringEquals(string str1, string str2)
        {
            return (str1 ?? string.Empty) == (str2 ?? string.Empty);
        }
    }
}