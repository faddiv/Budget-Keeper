import { useEffect, useState } from "react";
import { Tab, Tabs, Stack } from "react-bootstrap";
import { useParams } from "react-router";
import { toDateString, toErrorMessage, toMonthName, toMonthNumber } from "../../services/helpers";
import { CategoryStatistics, CategoryStatisticsSummary, statisticsService } from "../../services/walletApi";
import { CategoryTable } from "./components/categoryTable";
import { YearSelector } from "./components/yearSelector";
import { AlertsActions } from "../../services/actions/alerts";
import { useDispatch } from "react-redux";
import { endOfMonth, endOfYear } from "date-fns";

export interface CategoryStatisticsPageParams {
  year?: string;
}

export function CategoryStatisticsPage() {
  const { year } = useParams<CategoryStatisticsPageParams>();
  const year2 = parseInt(year || "0", 10) || new Date().getFullYear();
  const [summary, setSummary] = useState<CategoryStatisticsSummary>(empty);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const stats = await statisticsService.categories(year2);
        setSummary(stats);
      } catch (error) {
        setSummary(empty);
        dispatch(AlertsActions.showAlert({ type: "danger", message: toErrorMessage(error) }));
      }
    })();
  }, [dispatch, year2]);
  const yearStart = new Date(year2, 0, 1);
  const yearEnd = endOfYear(yearStart);
  const { yearly, monthly } = summary;

  return (
    <Stack>
      <YearSelector year={year2} link="/statistics/category" />
      <Tabs defaultActiveKey="yearly" id="statistics-tabs">
        <Tab key="yearly" eventKey="yearly" title="Full list">
          <CategoryTable categories={yearly} startDate={toDateString(yearStart)} endDate={toDateString(yearEnd)} />
        </Tab>
        {monthly.map((monthData: CategoryStatistics[], monthIndex: number) => {
          const monthStart = new Date(year2, monthIndex, 1);
          const monthKey = toMonthNumber(monthStart);
          const monthEnd = endOfMonth(monthStart);
          const monthName = toMonthName(monthStart);
          return (
            <Tab key={monthKey} eventKey={monthKey} title={monthName}>
              <CategoryTable categories={monthData} startDate={toDateString(monthStart)} endDate={toDateString(monthEnd)} />
            </Tab>
          );
        })}
      </Tabs>
    </Stack>
  );
}

const empty: CategoryStatisticsSummary = {
  monthly: [],
  yearly: [],
};
