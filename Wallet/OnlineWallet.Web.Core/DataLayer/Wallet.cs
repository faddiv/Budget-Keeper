using System.ComponentModel.DataAnnotations;

namespace OnlineWallet.Web.DataLayer
{
    public class Wallet
    {
        #region Properties

        [Key]
        public int MoneyWalletId { get; set; }

        [Required]
        public string Name { get; set; }

        #endregion
    }
}