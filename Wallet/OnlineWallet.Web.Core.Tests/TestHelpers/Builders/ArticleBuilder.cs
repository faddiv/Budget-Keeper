using System;
using OnlineWallet.Web.DataLayer;
using TestStack.Dossier;
using TestStack.Dossier.EquivalenceClasses;

namespace OnlineWallet.Web.TestHelpers.Builders
{
    public class ArticleBuilder : TestDataBuilder<Article, ArticleBuilder>
    {
        public ArticleBuilder()
        {
            Set(e => e.LastWalletId, () => Any.PositiveInteger() % 2 + 1);
            Set(e => e.Occurence, () => 1);
            Set(e => e.Category, () => Any.Category());
        }

        public virtual ArticleBuilder WithCategory(string category)
        {
            return Set(e => e.Category, category);
        }

        public virtual ArticleBuilder WithName(string name)
        {
            return Set(e => e.Name, name);
        }

        public virtual ArticleBuilder WithLastPrice(int lastPrice)
        {
            return Set(e => e.LastPrice, lastPrice);
        }

        public virtual ArticleBuilder WithOccurence(int occurence)
        {
            return Set(e => e.Occurence, occurence);
        }

        public virtual ArticleBuilder WithLastUpdate(DateTime lastUpdate)
        {
            return Set(e => e.LastUpdate, lastUpdate);
        }
    }
}