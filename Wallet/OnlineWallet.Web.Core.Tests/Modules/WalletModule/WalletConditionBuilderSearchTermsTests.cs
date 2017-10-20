using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.QueryLanguage.Conditions;
using Xunit;

namespace OnlineWallet.Web.Modules.WalletModule
{
    [Trait("WalletConditionBuilder", "Search terms")]
    public class WalletConditionBuilderSearchTermsTests
    {
        #region Fields

        private readonly List<Wallet> _result;

        #endregion

        #region  Constructors

        public WalletConditionBuilderSearchTermsTests()
        {
            var builder = new WalletConditionBuilder();
            var wallets = new List<Wallet>
            {
                new Wallet {Name = "ok"},
                new Wallet {Name = "Wrong"},
                new Wallet {Name = "This is ok too."},
                new Wallet {Name = "AlsoOK"}
            };
            _result = wallets.AsQueryable().Where(builder.Visit(new SearchTermCondition("ok"))).ToList();
        }

        #endregion

        #region  Public Methods

        [Fact(DisplayName = "Filter name by simple search term")]
        public void FilterNameBySimpleSearchTerm()
        {
            _result.Should().NotBeNullOrEmpty();
            _result.Should().NotContain(e => e.Name == "Wrong");
        }

        [Fact(DisplayName = "Filter name case insensitive")]
        public void FilterNameCaseInsensitive()
        {
            _result.Should().NotBeNullOrEmpty();
            _result.Should().NotContain(e => e.Name == "AlsoOK");
        }

        [Fact(DisplayName = "Filter name with string contains")]
        public void FilterNameWithStringContains()
        {
            _result.Should().NotBeNullOrEmpty();
            _result.Should().Contain(e => e.Name == "This is ok too.");
        }

        #endregion
    }
}