using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace OnlineWallet.Web.DataLayer
{
    public class Wallet
    {
        [Key]
        public int MoneyWalletId { get; set; }

        public string Name { get; set; }
    }
}