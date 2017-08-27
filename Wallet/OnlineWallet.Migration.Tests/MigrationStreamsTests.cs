using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Moq;
using OnlineWallet.Migration.Schema;
using Xunit;

namespace OnlineWallet.Migration
{
    public class MigrationStreamsTests
    {
        private readonly List<string> _fileList1 = new List<string> { "FileList1\\Költségek 1.txt", "FileList1\\Költségek 2.txt" };
        [Fact(DisplayName = "Collects individual files")]
        public void CollectsIndividualFiles()
        {
            var result = _fileList1
                .CollectFileList()?
                .ToList();
            result.Should().NotBeNullOrEmpty();
            ShouldBeTheFiles(result, _fileList1);
        }

        private void ShouldBeTheFiles(IList<string> actual, List<string> expected)
        {
            actual.Should().HaveCount(expected.Count);
            for (int i = 0; i < actual.Count; i++)
            {
                actual[i].Should().EndWith(expected[i]);
            }
        }

        [Fact(DisplayName = "Collects files when wildcard applied")]
        public void CollectsFilesWhenWildcardApplied()
        {
            var result = new List<string> { "FileList1/Költségek *.txt" }
                .CollectFileList()?
                .ToList();
            result.Should().NotBeNullOrEmpty();
            ShouldBeTheFiles(result, _fileList1);
        }

        [Fact(DisplayName = "Reads incomes")]
        public void ReadsIncomes()
        {
            var loader = new Mock<IXlstLoader>();
            var incomes1 = new List<Income> { new Income() };
            var incomes2 = new List<Income> { new Income() };
            loader.Setup(e => e.LoadIncome(It.IsAny<string>())).Returns((string file) =>
            {
                if (_fileList1[0] == file)
                    return incomes1;
                if (_fileList1[1] == file)
                    return incomes2;
                throw new Exception("Failll");
            });
            var result = _fileList1
                .ReadIncomes(loader.Object)?
                .ToList();
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            // ReSharper disable once PossibleNullReferenceException
            result[0].Should().Be(incomes1[0]);
            result[1].Should().Be(incomes2[0]);
        }

        [Fact(DisplayName = "Reads expenses")]
        public void ReadsExpenses()
        {
            var loader = new Mock<IXlstLoader>();
            var expenses1 = new List<Expense> { new Expense() };
            var expenses2 = new List<Expense> { new Expense() };
            loader.Setup(e => e.LoadExpense(It.IsAny<string>())).Returns((string file) =>
            {
                if (_fileList1[0] == file)
                    return expenses1;
                if (_fileList1[1] == file)
                    return expenses2;
                throw new Exception("Failll");
            });
            var result = _fileList1
                .ReadExpenses(loader.Object)?
                .ToList();
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            // ReSharper disable once PossibleNullReferenceException
            result[0].Should().Be(expenses1[0]);
            result[1].Should().Be(expenses2[0]);
        }

        [Fact(DisplayName = "Leaves zero income")]
        public void LeavesZeroIncome()
        {
            var incomes = new List<Income>
            {
                new Income{Amount = 100},
                new Income{Amount = 0},
                new Income()
            };
            var filteredIncomes = incomes.FilterZeroEntries()?.ToList();
            filteredIncomes.Should().HaveCount(1);
            filteredIncomes[0].Amount.Should().Be(100);
        }
    }
}
