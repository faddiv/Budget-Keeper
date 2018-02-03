import { walletApiConfig, ThenJson } from "./walletApiConfig";
import { YearlyStatistics, CategoryStatisticsSummary, BalanceInfo } from "./model";
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

    async balanceInfo(year: number, month: number): Promise<BalanceInfo> {
        const url = buildUrl(urlBase + "/BalanceInfo", walletApiConfig.baseUrl, { year, month });

        const response = await fetch(url.toString());
        const result = await ThenJson<BalanceInfo>(response);
        return result;
    }

}

export const statisticsService = new StatisticsService();
