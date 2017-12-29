using System;
using System.Collections.Generic;
using System.Text;
using OnlineWallet.ExportImport;
using OnlineWallet.Web.DataLayer;
using TestStack.Dossier;
using TestStack.Dossier.EquivalenceClasses;
using Ploeh.AutoFixture;

namespace OnlineWallet.Web.TestHelpers.Builders
{
    public class TransactionBuilder : TestDataBuilder<Transaction, TransactionBuilder>
    {
        public TransactionBuilder()
        {
            Set(e => e.TransactionId, 0);
            Set(e => e.WalletId, () => Any.PositiveInteger() % 2 + 1);
        }

        public virtual TransactionBuilder WithCreatedAt(string date)
        {
            var realDate = DateTime.Parse(date);
            return Set(e => e.CreatedAt, realDate);
        }

        public virtual TransactionBuilder WithCreatedAt(string from, string to)
        {
            var fromDate = DateTime.Parse(from);
            var toDate = DateTime.Parse(to);
            Random r = new Random();
            var days = (int)Math.Floor((toDate - fromDate).TotalDays) + 1;
            return Set(e => e.CreatedAt, () => fromDate.AddDays(r.Next(days)));
        }

        public virtual TransactionBuilder WithDirection(MoneyDirection direction)
        {
            return Set(e => e.Direction, direction);
        }

        public virtual TransactionBuilder WithCategory(string category)
        {
            return Set(e => e.Category, category);
        }

        public virtual TransactionBuilder WithCategoryRandom()
        {
            return Set(e => e.Category, () => Any.StringOfLength(5));
        }

        public virtual TransactionBuilder WithName(string name)
        {
            return Set(e => e.Name, name);
        }

        public virtual TransactionBuilder WithValue(int value)
        {
            return Set(e => e.Value, value);
        }

        public virtual TransactionBuilder WithWallet(Wallet wallet)
        {
            return Set(e => e.WalletId, wallet.MoneyWalletId);
        }
    }
}
