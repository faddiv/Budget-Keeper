using System.Collections.Generic;
using System.IO;

namespace OnlineWallet.ExportImport
{
    public interface ICsvExportImport
    {
        void ExportTransactions(IEnumerable<ExportImportRow> imports, Stream stream);
        IEnumerable<ExportImportRow> ImportTransactions(Stream stream);
    }
}
