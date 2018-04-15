using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using FluentAssertions.Collections;
using FluentAssertions.Execution;
using OnlineWallet.Web.DataLayer;

namespace OnlineWallet.Web.TestHelpers
{
    public class ArticleListAssertion : SelfReferencingCollectionAssertions<Article, ArticleListAssertion>
    {
        #region  Constructors

        public ArticleListAssertion(IEnumerable<Article> article) : base(article)
        {
        }

        #endregion

        #region Properties

        protected override string Context => "ArticleList";

        #endregion

        #region  Public Methods

        public AndConstraint<ArticleListAssertion> HaveDistinctArticleNamesOnlyFrom(
            IEnumerable<Transaction> transactions, string because = "", params object[] becauseParams)
        {
            var countArticleNames = transactions.Select(e => e.Name.ToLower()).Distinct().Count();
            Execute.Assertion
                .BecauseOf(because, becauseParams)
                .ForCondition(Subject.Count() == countArticleNames)
                .FailWith("Expected {context:ArticleList} to have {0} element{reason}, but found {1}.",
                    countArticleNames, Subject.Count());

            return new AndConstraint<ArticleListAssertion>(this);
        }

        #endregion
    }
}