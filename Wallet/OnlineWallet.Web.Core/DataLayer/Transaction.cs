using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using OnlineWallet.ExportImport;

namespace OnlineWallet.Web.DataLayer
{
    public class Transaction
    {
        #region Properties

        [StringLength(200)] public string Category { get; set; }

        [StringLength(Int32.MaxValue)] public string Comment { get; set; }

        [Required] public DateTime CreatedAt { get; set; }

        [Required]
        [EnumDataType(typeof(MoneyDirection))]
        public MoneyDirection Direction { get; set; }

        [Required] [StringLength(200)] public string Name { get; set; }

        [Key] public long TransactionId { get; set; }

        [Required] public int Value { get; set; }

        [JsonIgnore] public Wallet Wallet { get; set; }

        [Required] public int WalletId { get; set; }

        #endregion

        #region  Public Methods

        public override string ToString()
        {
            return $"{Value} {Direction} [{Category}:{Name}]";
        }

        #endregion
    }
}