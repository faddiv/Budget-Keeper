using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Moq;
using OnlineWallet.ExportImport;
using Xunit;

namespace OnlineWallet.Migration
{
    [Trait("MigrationStreams", null)]
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
            var incomes1 = new List<ExportImportRow> { new ExportImportRow { Amount = 100 } };
            var incomes2 = new List<ExportImportRow> { new ExportImportRow { Amount = 100 } };
            loader.Setup(e => e.LoadExpense(It.IsAny<string>())).Returns((string file) =>
            {
                if (_fileList1[0] == file)
                    return incomes1;
                if (_fileList1[1] == file)
                    return incomes2;
                throw new Exception("Failll");
            });
            var result = _fileList1
                .ReadExpenses(loader.Object)?
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
            var expenses1 = new List<ExportImportRow> { new ExportImportRow() };
            var expenses2 = new List<ExportImportRow> { new ExportImportRow() };
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
            var incomes = new List<ExportImportRow>
            {
                new ExportImportRow{Amount = 100},
                new ExportImportRow{Amount = 0},
                new ExportImportRow()
            };
            var filteredIncomes = incomes.FilterZeroEntries()?.ToList();
            filteredIncomes.Should().HaveCount(1);
            // ReSharper disable once PossibleNullReferenceException
            filteredIncomes[0].Amount.Should().Be(100);
        }
    }
}
