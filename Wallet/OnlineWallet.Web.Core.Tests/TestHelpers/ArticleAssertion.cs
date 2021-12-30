using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.TestHelpers
{
    public class ArticleAssertion : ReferenceTypeAssertions<Article, ArticleAssertion>
    {
        #region  Constructors

        public ArticleAssertion(Article article) : base(article)
        {
        }

        #endregion

        #region Properties

        protected override string Identifier => nameof(Article);

        #endregion

        #region  Public Methods

        public AndWhichConstraint<ArticleAssertion, Transaction> BasedOn(Transaction transaction, string because = "",
            params object[] becauseParams)
        {
            Execute.Assertion
                .BecauseOf(because, becauseParams)
                .ForCondition(Subject.Category == transaction.Category)
                .FailWith("Expected {context:Article} to have Category {0}{reason}, but found {1}.",
                    transaction.Category, Subject.Category)
                .Then
                .ForCondition(Subject.LastPrice == transaction.Value)
                .FailWith("Expected {context:Article} to have LastPrice {0}{reason}, but found {1}.", transaction.Value,
                    Subject.LastPrice)
                .Then
                .ForCondition(Subject.LastUpdate == transaction.CreatedAt)
                .FailWith("Expected {context:Article} to have LastUpdate {0}{reason}, but found {1}.",
                    transaction.CreatedAt, Subject.LastUpdate)
                .Then
                .ForCondition(Subject.LastWalletId == transaction.WalletId)
                .FailWith("Expected {context:Article} to have LastWalletId {0}{reason}, but found {1}.",
                    transaction.WalletId, Subject.LastWalletId)
                .Then
                .ForCondition(Subject.Name == transaction.Name)
                .FailWith("Expected {context:Article} to have Name {0}{reason}, but found {1}.", transaction.Name,
                    Subject.Name);

            return new AndWhichConstraint<ArticleAssertion, Transaction>(this, transaction);
        }

        #endregion
    }
}
