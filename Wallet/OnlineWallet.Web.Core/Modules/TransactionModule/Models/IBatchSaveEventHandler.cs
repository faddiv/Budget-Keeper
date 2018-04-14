namespace OnlineWallet.Web.Modules.TransactionModule.Models
{
    public interface IBatchSaveEventHandler
    {
        #region  Public Methods

        void Execute(TransactionEventArgs args);

        #endregion
    }
}