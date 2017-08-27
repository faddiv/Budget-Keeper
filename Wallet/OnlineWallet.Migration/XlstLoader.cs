using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;
using NPOI.SS.UserModel;
using OnlineWallet.Migration.Schema;

namespace OnlineWallet.Migration
{
    public class XlstLoader : IXlstLoader
    {
        #region Fields

        private readonly Regex _monthYear;
        private IWorkbook _workbook;

        #endregion

        #region  Constructors

        public XlstLoader()
        {
            _monthYear = new Regex("(\\d{4})\\.(\\d{2})");
        }

        #endregion

        #region  Public Methods

        public IEnumerable<Expense> LoadExpense(string fileName)
        {
            OpenFile(fileName);
            try
            {
                for (int i = _workbook.NumberOfSheets - 1; i >= 0; i--)
                {
                    var match = _monthYear.Match(_workbook.GetSheetName(i));
                    if (!match.Success) continue;
                    var year = short.Parse(match.Groups[1].Value);
                    var month = short.Parse(match.Groups[2].Value);
                    var sheet = _workbook.GetSheetAt(i);
                    var expected = sheet.GetRow(0).GetCell(3).NumericCellValue;
                    var actual = 0.0;
                    foreach (IRow row in sheet)
                    {
                        if (row.Cells.Count < 3) continue;
                        if (row.Cells[0].CellType == CellType.String) continue;
                        if (row.GetCell(0)?.CellType == CellType.Blank) continue;
                        var created = row.GetCell(0)?.DateCellValue;
                        var name = row.GetCell(1)?.StringCellValue;
                        var category = row.GetCell(2)?.StringCellValue;
                        var amount = row.GetCell(3)?.NumericCellValue;
                        var isCash = !IsEmptyCell(row.GetCell(4));
                        var commentCell = row.GetCell(6);
                        var comment = commentCell?.CellType == CellType.String
                            ? commentCell.StringCellValue
                            : commentCell?.NumericCellValue.ToString(CultureInfo.CurrentCulture);
                        if (comment == "0") comment = null;
                        if (!created.HasValue && string.IsNullOrWhiteSpace(name) && amount.GetValueOrDefault() == 0)
                        {
                            continue;
                        }
                        if (!created.HasValue)
                        {
                            throw new Exception($"No date on row. File: {fileName} sheet: {_workbook.GetSheetName(i)} Line: {row.RowNum}");
                        }
                        if (year != created.Value.Year)
                        {
                            throw new Exception($"date does not match on row. File: {fileName} sheet: {_workbook.GetSheetName(i)} Line: {row.RowNum} Expected: {year}.{month} Actual: {created:yyyy-MM-dd}");
                        }
                        if (amount.HasValue)
                        {
                            actual += amount.Value;
                            yield return new Expense
                            {
                                Created = created.GetValueOrDefault(),
                                Name = name,
                                Category = category,
                                Amount = amount.GetValueOrDefault(),
                                Source = isCash ? MoneySource.Cash : MoneySource.BankAccount,
                                Comment = comment,
                            };
                        }
                    }
                    if (Math.Abs(Math.Abs(expected) - actual) > double.Epsilon)
                    {
                        throw new Exception($"Checksum error in file : {fileName} sheet: {_workbook.GetSheetName(i)} Expected: {expected} Actual: {actual}");
                    }
                }
            }
            finally
            {
                _workbook.Close();
                _workbook = null;
            }
        }


        public IEnumerable<Income> LoadIncome(string fileName)
        {
            OpenFile(fileName);
            try
            {
                for (int i = _workbook.NumberOfSheets - 1; i >= 0; i--)
                {
                    var match = _monthYear.Match(_workbook.GetSheetName(i));
                    if (!match.Success) continue;
                    var year = short.Parse(match.Groups[1].Value);
                    var month = short.Parse(match.Groups[2].Value);
                    var sheet = _workbook.GetSheetAt(i);
                    var incomeRows = sheet.GetRow(1);
                    var sumRow = incomeRows.GetCell(3);
                    var cashRow = incomeRows.GetCell(4);
                    var bankRow = incomeRows.GetCell(5);
                    if (sumRow.CellType != CellType.Numeric && sumRow.CellType != CellType.Formula)
                        continue;
                    foreach (var cashAmount in GetCellParts(cashRow))
                    {
                        yield return new Income
                        {
                            Year = year,
                            Month = month,
                            Amount = cashAmount,
                            Source = MoneySource.Cash
                        };
                    }
                    foreach (var bankAmount in GetCellParts(bankRow))
                    {
                        yield return new Income
                        {
                            Year = year,
                            Month = month,
                            Amount = bankAmount,
                            Source = MoneySource.BankAccount
                        };
                    }
                }
            }
            finally
            {
                _workbook.Close();
                _workbook = null;
            }
        }

        #endregion

        #region  Nonpublic Methods

        private IEnumerable<double> GetCellParts(ICell cell)
        {
            if (cell.CellType == CellType.Blank) yield break;
            if (cell.CellType == CellType.Numeric)
            {
                yield return cell.NumericCellValue;
            }
            if (cell.CellType == CellType.Formula)
            {
                var parts = cell.CellFormula.Split(new[] {'=', '+'}, StringSplitOptions.RemoveEmptyEntries);
                foreach (var part in parts)
                {
                    yield return double.Parse(part);
                }
            }
        }

        private bool IsEmptyCell(ICell cell)
        {
            if (cell == null)
            {
                return true;
            }
            if (cell.CellType == CellType.Blank)
            {
                return true;
            }
            return cell.CellType == CellType.String
                   && string.IsNullOrEmpty(cell.StringCellValue);
        }

        private void OpenFile(string fileName)
        {
            _workbook = WorkbookFactory.Create(fileName);
        }

        #endregion
    }
}