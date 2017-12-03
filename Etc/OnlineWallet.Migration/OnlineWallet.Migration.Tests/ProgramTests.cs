using System;
using System.IO;
using System.Text;
using FluentAssertions;
using Xunit;

namespace OnlineWallet.Migration
{
    [Trait("Program", null)]
    public class ProgramTests
    {
        [Fact(DisplayName = "Adds extension if no csv")]
        public void AddExtensionIfNoCsv()
        {
            Program.AddExtension("asdf").Should().Be("asdf.csv");
        }
        [Fact(DisplayName = "Leave untouched if has extension csv")]
        public void LeaveUntouchedIfHasExtensionCsv()
        {
            Program.AddExtension("asdf.csv").Should().Be("asdf.csv");
        }

        [Fact(DisplayName = "Migration test for OnlineWallet.Migration")]
        public void MigrationTestForOnlineWalletMigration()
        {
            //Arrange
            const string inpomesPath = "Incomes.csv";
            const string expensesPath = "Expenses.csv";
            File.Delete(inpomesPath);
            File.Delete(expensesPath);

            //Act
            Program.Main(new []{ "InputFiles/Koltsegek *.xlsx" });

            //Assert
            File.Exists(inpomesPath).Should().BeTrue();
            File.Exists(expensesPath).Should().BeTrue();
            string incomeText = File.ReadAllText(inpomesPath);
            incomeText.Length.Should().BeGreaterThan(30);
            incomeText.Should().Contain("110000", "reads cash payments");
            incomeText.Should().Contain("86000", "reads bank payments");
            incomeText.Should().NotContain(",0,", "leave out 0 incomes");
            incomeText.Should().Contain(",Income", "adds direction");
            string expenseText = File.ReadAllText(expensesPath);
            expenseText.Length.Should().BeGreaterThan(30);
            expenseText.Should().Contain("2011 egy költsége", "reads items from 2011");
            expenseText.Should().Contain("2012 egy költsége", "reads items from 2012");
            expenseText.Should().Contain("123456", "reads expenses");
            expenseText.Should().Contain("2012 kommentje", "reads comments");
            expenseText.Should().Contain(",Expense", "adds direction");
        }
        
        [Fact(DisplayName = "Migration test: Meaningful error on checksum error")]
        public void MigrationTestMeaningfulErrorOnChecksumError()
        {
            var stringBuilder = new StringBuilder();
            Console.SetError(new StringWriter(stringBuilder));

            //Act
            Program.Main(new[] { "Errors/Koltsegek *.xlsx" });

            //Assert
            var output = stringBuilder.ToString();
            output.Should().Contain("Koltsegek 2011.xlsx");
            output.Should().Contain("2011.12");
        }

        [Fact(DisplayName = "Migration test: Throw error on empty money")]
        public void ThrowErrorOnEmptyMoney()
        {
            var stringBuilder = new StringBuilder();
            Console.SetError(new StringWriter(stringBuilder));
            var errorsHibasXlsx = "Errors\\Hibas 1.xlsx";

            //Act
            Program.Main(new[] { errorsHibasXlsx });

            //Assert
            var output = stringBuilder.ToString();
            output.Should().Contain("No price was provided for");
            output.Should().Contain(errorsHibasXlsx);
            output.Should().Contain("2012.12");
            output.Should().Contain("Line: 2");
        }

        [Fact(DisplayName = "Migration test: Throw error if no money wallet")]
        public void ThrowErrorIfNoMoneyWallet()
        {
            var stringBuilder = new StringBuilder();
            Console.SetError(new StringWriter(stringBuilder));
            var errorsHibasXlsx = "Errors\\Hibas 2.xlsx";

            //Act
            Program.Main(new[] { errorsHibasXlsx });

            //Assert
            var output = stringBuilder.ToString();
            output.Should().Contain("No wallet found for row.");
            output.Should().Contain(errorsHibasXlsx);
            output.Should().Contain("2012.12");
            output.Should().Contain("Line: 2");
        }

        [Fact(DisplayName = "Migration test: Throw error if multiple money wallet")]
        public void ThrowErrorIfMultipleMoneyWallet()
        {
            var stringBuilder = new StringBuilder();
            Console.SetError(new StringWriter(stringBuilder));
            var errorsHibasXlsx = "Errors\\Hibas 3.xlsx";

            //Act
            Program.Main(new[] { errorsHibasXlsx });

            //Assert
            var output = stringBuilder.ToString();
            output.Should().Contain("Multiple wallet found for row.");
            output.Should().Contain(errorsHibasXlsx);
            output.Should().Contain("2012.12");
            output.Should().Contain("Line: 2");
        }
    }
}