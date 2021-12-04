import { ExportImportRow } from "./model";
import { ThenJson, buildUrl } from "../helpers";

const importUrl = "/api/v1/Import/ProcessTransactions";
const exportUrl = "/api/v1/Export";

class ImportExportService {

    async uploadTransactions(file: File): Promise<ExportImportRow[]> {
        const url = buildUrl([importUrl]);
        const formData = new FormData();
        formData.append("file", file as any, file.name);
        const response = await fetch(url.toString(), {
            method: "POST",
            mode: "cors",
            body: formData
        });
        const result = await ThenJson<ExportImportRow[]>(response);
        return result;
    }

    exportRange(from: string, to: string, fileName: string): void {
        window.location.href = `${exportUrl}?from=${from}&to=${to}&fileName=${fileName}`;
    }

}

export const importExportService = new ImportExportService();
