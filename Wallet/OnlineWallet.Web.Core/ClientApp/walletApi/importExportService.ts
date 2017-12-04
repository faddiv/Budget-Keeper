import { walletApiConfig, ThenJson } from "./walletApiConfig";
import { ExportImportRow } from "./model";
import { buildUrl } from "./linkHelpers";

const importUrl = "/api/v1/Import/ProcessTransactions";
const exportUrl = "/api/v1/Export"

class ImportExportService {

    async uploadTransactions(file: File): Promise<ExportImportRow[]> {
        var url = buildUrl(importUrl, walletApiConfig.baseUrl);
        let formData = new FormData();
        formData.append('file', <any>file, file.name);
        const response = await fetch(url.toString(), {
            method: "POST",
            mode: "cors",
            body: formData
        });
        const result = await ThenJson<ExportImportRow[]>(response);
        return result;
    }

    exportRange(from: string, to: string, fileName: string): void {
        window.location.href = walletApiConfig.baseUrl + exportUrl + "?from=" + from + "&to=" + to + "&fileName=" + fileName;
    }

}

export var importExportService = new ImportExportService();