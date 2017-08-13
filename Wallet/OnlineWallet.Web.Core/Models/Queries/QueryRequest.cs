namespace OnlineWallet.Web.Models.Queries
{
    public class QueryRequest
    {
        public int? Take { get; set; }
        public int? Skip { get; set; }
        public string Search { get; set; }
    }
}