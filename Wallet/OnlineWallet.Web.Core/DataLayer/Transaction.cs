using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace OnlineWallet.Web.DataLayer
{
    public class Transaction
    {
        #region Properties

        [StringLength(Int32.MaxValue)]
        public string Comment { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        [EnumDataType(typeof(MoneyDirection))]
        public MoneyDirection Direction { get; set; }

        [Key]
        public long TransactionId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(200)]
        public string Category { get; set; }

        [Required]
        public int Value { get; set; }

        [JsonIgnore]
        public Wallet Wallet { get; set; }

        [Required]
        public int WalletId { get; set; }

        #endregion
    }
}