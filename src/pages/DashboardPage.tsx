import BButton from "@/components/ui-custom/BButton";
import CartesianGrid from "@/components/ui-custom/CartesianGrid";
import CContainer from "@/components/ui-custom/CContainer";
import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import DateRangePickerInput from "@/components/ui-custom/DateRangePickerInput";
import FeedbackRetry from "@/components/ui-custom/FeedbackRetry";
import Heading5 from "@/components/ui-custom/Heading5";
import { Type__DateRange } from "@/constants/types";
import useDataState from "@/hooks/useDataState";
import capsFirstLetter from "@/utils/capsFirstLetter";
import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartSummary = {
  daily?: { date: string; total: number }[];
  monthly?: { monthYear: string; total: number }[];
  annual?: { year: string; total: number }[];
};

type Period = "daily" | "monthly" | "annual";

const getThisMonthRange = (): Type__DateRange => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: start.toISOString().split("T")[0],
    to: end.toISOString().split("T")[0],
  };
};
const PERIODS: Period[] = ["daily", "monthly", "annual"];

const RevenueChart = () => {
  // States
  const [dateRange, setDateRange] = useState<Type__DateRange>(
    getThisMonthRange()
  );
  const [period, setPeriod] = useState<Period>("daily");
  const { data, loading, error, makeRequest } = useDataState<ChartSummary>({
    url: `/transactions/get-chart-summary`,
    payload: {
      startDate: dateRange.from,
      endDate: dateRange.to,
      startMonth: (dateRange.from as string).slice(5, 7),
      endMonth: (dateRange.to as string).slice(5, 7),
      startYear: (dateRange.from as string).slice(0, 4),
      endYear: (dateRange.to as string).slice(0, 4),
    },
    dependencies: [dateRange],
  });
  const chartData = () => {
    if (!data || !data[period]) return [];

    return data[period].map((item: any) => {
      let name = "";
      if (period === "daily") {
        const date = new Date(item.date);
        name = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
          .getDate()
          .toString()
          .padStart(2, "0")}`;
      } else if (period === "monthly") {
        name = item.monthYear;
      } else if (period === "annual") {
        name = item.year;
      }

      return {
        name,
        value: item.total,
      };
    });
  };

  return (
    <CContainer gap={4}>
      <HStack justify={"space-between"} wrap={"wrap"}>
        <HStack p={2} bg={"white"} w={"fit"} borderRadius={8}>
          {PERIODS.map((item) => {
            const active = period === item;
            return (
              <BButton
                key={item}
                variant={active ? "solid" : "ghost"}
                colorPalette={"p"}
                color={active ? "p.800" : "fg.subtle"}
                size={"xs"}
                onClick={() => setPeriod(item)}
              >
                {capsFirstLetter(item)}
              </BButton>
            );
          })}
        </HStack>

        <HStack p={2} bg={"white"} w={"fit"} borderRadius={8}>
          <DateRangePickerInput
            w={"fit"}
            onConfirm={(input) => {
              setDateRange(input);
            }}
            inputValue={dateRange}
            borderColor={"transparent"}
            nonNullable
          />
        </HStack>
      </HStack>

      <CContainer h={"400px"} p={4} pl={0} borderRadius={16} bg={"white"}>
        <CContainer px={4} pb={6}>
          <Heading5 fontWeight={"bold"}>Revenue Analysis</Heading5>
        </CContainer>

        {loading && <ComponentSpinner />}

        {!loading && (
          <>
            {error && <FeedbackRetry onRetry={makeRequest} />}

            {!error && (
              <ResponsiveContainer>
                <LineChart data={chartData()}>
                  <CartesianGrid />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#B9A888"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </CContainer>
    </CContainer>
  );
};

const TotalTxsChart = () => {
  // States
  const [dateRange, setDateRange] = useState<Type__DateRange>(
    getThisMonthRange()
  );
  const [period, setPeriod] = useState<Period>("daily");
  const { data, loading, error, makeRequest } = useDataState<ChartSummary>({
    url: `/transactions/get-chart-count`,
    payload: {
      startDate: dateRange.from,
      endDate: dateRange.to,
      startMonth: (dateRange.from as string).slice(5, 7),
      endMonth: (dateRange.to as string).slice(5, 7),
      startYear: (dateRange.from as string).slice(0, 4),
      endYear: (dateRange.to as string).slice(0, 4),
    },
    dependencies: [dateRange],
  });
  const chartData = () => {
    if (!data || !data[period]) return [];

    return data[period].map((item: any) => {
      let name = "";
      if (period === "daily") {
        const date = new Date(item.date);
        name = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
          .getDate()
          .toString()
          .padStart(2, "0")}`;
      } else if (period === "monthly") {
        name = item.monthYear;
      } else if (period === "annual") {
        name = item.year;
      }

      return {
        name,
        value: item.total,
      };
    });
  };

  return (
    <CContainer gap={4}>
      <HStack justify={"space-between"} wrap={"wrap"}>
        <HStack p={2} bg={"white"} w={"fit"} borderRadius={8}>
          {PERIODS.map((item) => {
            const active = period === item;
            return (
              <BButton
                key={item}
                variant={active ? "solid" : "ghost"}
                colorPalette={"p"}
                color={active ? "p.800" : "fg.subtle"}
                size={"xs"}
                onClick={() => setPeriod(item)}
              >
                {capsFirstLetter(item)}
              </BButton>
            );
          })}
        </HStack>

        <HStack p={2} bg={"white"} w={"fit"} borderRadius={8}>
          <DateRangePickerInput
            w={"fit"}
            onConfirm={(input) => {
              setDateRange(input);
            }}
            inputValue={dateRange}
            borderColor={"transparent"}
            nonNullable
          />
        </HStack>
      </HStack>

      <CContainer h={"400px"} p={4} pl={0} borderRadius={16} bg={"white"}>
        <CContainer px={4} pb={6}>
          <Heading5 fontWeight={"bold"}>Transaction Analysis</Heading5>
        </CContainer>

        {loading && <ComponentSpinner />}

        {!loading && (
          <>
            {error && <FeedbackRetry onRetry={makeRequest} />}

            {!error && (
              <ResponsiveContainer>
                <LineChart data={chartData()}>
                  <CartesianGrid />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#B9A888"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </CContainer>
    </CContainer>
  );
};

const DashboardPage = () => {
  return (
    <CContainer p={4} gap={4}>
      <RevenueChart />

      <TotalTxsChart />
    </CContainer>
  );
};

export default DashboardPage;
