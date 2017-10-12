namespace OnlineWallet.Web.Modules.TransactionModule
{
    public class BalanceInfo
    {
        public int Spent { get; set; }
        public int Income { get; set; }
        public int ToSaving { get; set; }
        public int Planned { get; set; }

        public int Unused => Income - Spent - ToSaving - Planned;
    }
}
