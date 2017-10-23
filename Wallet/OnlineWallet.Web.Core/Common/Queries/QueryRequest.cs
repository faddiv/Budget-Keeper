namespace OnlineWallet.Web.Common.Queries
{
    public class QueryRequest
    {
        #region Properties

        public string Search { get; set; }
        public int? Skip { get; set; }
        public int? Take { get; set; }
        public string Sorting { get; set; }

        #endregion
    }
}