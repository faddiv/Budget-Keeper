namespace OnlineWallet.Web.Modules.StatisticsModule.Models
{
    public class CategoryStatistics
    {
        #region Properties

        public int Count { get; set; }
        public string Name { get; set; }
        public int Spent { get; set; }
        public double SpentPercent { get; set; }

        #endregion
    }
}