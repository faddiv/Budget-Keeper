using System.Collections.Generic;
using System.IO;

namespace OnlineWallet.ExportImport
{
    public interface ICsvExportImport
    {
        void ExportTransactions(IEnumerable<ExportImportRow> imports, string path);
        IEnumerable<ExportImportRow> ImportTransactions(Stream stream);
    }
}
