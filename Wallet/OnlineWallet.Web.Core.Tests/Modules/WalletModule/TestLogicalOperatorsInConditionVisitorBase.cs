using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using OnlineWallet.Web.DataLayer;
using OnlineWallet.Web.Modules.WalletModule;
using OnlineWallet.Web.QueryLanguage.Conditions;
using Xunit;

namespace OnlineWallet.Web.Core.Modules.WalletModule
{
    public class TestLogicalOperatorsInConditionVisitorBase
    {
        private readonly WalletConditionBuilder _builder = new WalletConditionBuilder();

        [Fact(DisplayName = "It applies and operator")]
        public void AppliesAndOperator()
        {
            var wallets = new List<Wallet>
            {
                new Wallet { Name = "1" },
                new Wallet { Name = "2" },
                new Wallet { Name = "3" },
                new Wallet { Name = "1 2 3" }
            };
            var condition = new LogicalOperatorCondition(LogicalOperator.And)
            {
                Operands =
                {
                    new SearchTermCondition("1"),
                    new SearchTermCondition("2")
                }
            };
            var result = wallets.AsQueryable().Where(_builder.Visit(condition)).ToList<Wallet>();
            result.Should().NotBeNullOrEmpty();
            result.Should().HaveCount(1);
            result.Should().Contain(e => e.Name == "1 2 3");
        }

        [Fact(DisplayName = "It applies or operator")]
        public void ItAppliesOrOperator()
        {
            var wallets = new List<Wallet>
            {
                new Wallet { Name = "1" },
                new Wallet { Name = "2" },
                new Wallet { Name = "3" },
                new Wallet { Name = "1 2 3" }
            };
            var condition = new LogicalOperatorCondition(LogicalOperator.Or)
            {
                Operands =
                {
                    new SearchTermCondition("1"),
                    new SearchTermCondition("2")
                }
            };
            var result = wallets.AsQueryable().Where(_builder.Visit(condition)).ToList<Wallet>();
            result.Should().NotBeNullOrEmpty();
            result.Should().HaveCount(3);
            result.Should().OnlyContain(e => e.Name.Contains("1") || e.Name.Contains("2"));
        }
    }
}