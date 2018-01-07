import { walletApiConfig, ThenJson } from "./walletApiConfig";
import { YearlyStatistics, CategoryStatisticsSummary } from "./model";
import { buildUrl } from "./linkHelpers";

const urlBase = "/api/v1/Statistics";

class StatisticsService {

    async yearly(year: number): Promise<YearlyStatistics> {
        const url = buildUrl(urlBase + "/Yearly", walletApiConfig.baseUrl, {
            year
        });
        const response = await fetch(url.toString());
        const result = await ThenJson<YearlyStatistics>(response);
        return result;
    }

    async categories(year: number): Promise<CategoryStatisticsSummary> {
        const url = buildUrl(urlBase + "/Categories", walletApiConfig.baseUrl, {
            year
        });
        const response = await fetch(url.toString());
        const result = await ThenJson<CategoryStatisticsSummary>(response);
        return result;
    }
}

export const statisticsService = new StatisticsService();
