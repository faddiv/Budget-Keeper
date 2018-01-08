namespace OnlineWallet.Web.Modules.ArticleModule
{
    public class ArticleModel
    {
        #region Properties

        public string Category { get; set; }
        public int LastPrice { get; set; }
        public string Name { get; set; }
        public string NameHighlighted { get; set; }
        public int Occurence { get; set; }
        public int LastWallet { get; internal set; }

        #endregion
    }
}