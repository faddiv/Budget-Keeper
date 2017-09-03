using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace OnlineWallet.Web.DataLayer
{
    public class MoneyOperation
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
        public long MoneyOperationId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        public int Value { get; set; }

        [JsonIgnore]
        public Wallet Wallet { get; set; }

        [Required]
        public int WalletId { get; set; }

        #endregion
    }
}