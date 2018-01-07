import { CategoryStatistics } from "./CategoryStatistics";

export interface CategoryStatisticsSummary {
    yearly: CategoryStatistics[];
    monthly: CategoryStatistics[][];
}
