using System.Collections.Generic;
using System.IO;

namespace OnlineWallet.ExportImport
{
    public interface ICsvExportImport
    {
        void ExportMoneyOperations(IEnumerable<ExportImportRow> imports, string path);
        IEnumerable<ExportImportRow> ImportMoneyOperations(Stream stream);
    }
}
