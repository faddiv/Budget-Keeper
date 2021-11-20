using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OnlineWallet.Web.DataLayer
{
    public class Article
    {
        #region Properties

        [StringLength(200)] public string? Category { get; set; }

        [Required] public int LastPrice { get; set; }

        [Required] public DateTime LastUpdate { get; set; }

        [JsonIgnore]
        [ForeignKey(nameof(LastWalletId))]
        public Wallet? LastWallet { get; set; }

        [Required] public int LastWalletId { get; set; }

        [Key] [Required] [StringLength(200)] public string Name { get; set; } = "";

        [Required] public int Occurence { get; set; }

        #endregion
    }
}
