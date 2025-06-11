import BButton from "@/components/ui-custom/BButton";
import CartesianGrid from "@/components/ui-custom/CartesianGrid";
import CContainer from "@/components/ui-custom/CContainer";
import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import DateRangePickerInput from "@/components/ui-custom/DateRangePickerInput";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import FeedbackRetry from "@/components/ui-custom/FeedbackRetry";
import Heading5 from "@/components/ui-custom/Heading5";
import TimePickerInput from "@/components/ui-custom/TimePickerInput";
import { Field } from "@/components/ui/field";
import { Type__DateRange } from "@/constants/types";
import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import useRenderTrigger from "@/hooks/useRenderTrigger";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import capsFirstLetter from "@/utils/capsFirstLetter";
import formatDuration from "@/utils/formatDuration";
import {
  FieldsetRoot,
  HStack,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IconEdit } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as yup from "yup";

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

const UpdateRule = (props: any) => {
  // Props
  const { item } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`update-rule-${item?.id}`, open, onOpen, onClose);
  const { req, loading } = useRequest({
    id: `edit-rule-${item?.id}`,
  });

  // Contexts
  const { l } = useLang();
  const { rt, setRt } = useRenderTrigger();

  // States
  const minutesToHMS = (minutes: number): string => {
    const totalSeconds = Math.floor(minutes * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (val: number) => String(val).padStart(2, "0");

    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };
  const hmsToMinutes = (hms: string): number => {
    const [h = "0", m = "0", s = "0"] = hms.split(":");
    const hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);
    const seconds = parseInt(s, 10);

    return hours * 60 + minutes + seconds / 60;
  };
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      value: minutesToHMS(item?.value),
    },
    validationSchema: yup.object().shape({
      value: yup.string().required(l.required_form),
    }),
    onSubmit: (values) => {
      console.log(values);

      const payload = {
        id: item?.id,
        rulesType: item?.rulesType,
        value: hmsToMinutes(values.value),
      };

      const config = {
        url: "/rules/update",
        method: "post",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt(rt);
          },
        },
      });
    },
  });

  return (
    <>
      <BButton iconButton size={"xs"} variant={"ghost"} onClick={onOpen}>
        <Icon boxSize={5}>
          <IconEdit />
        </Icon>
      </BButton>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Update Rule`} />
          </DisclosureHeader>

          <DisclosureBody>
            <FieldsetRoot disabled={loading}>
              <form id="update-rule-form" onSubmit={formik.handleSubmit}>
                <Field
                  label="Countdown Duration"
                  invalid={!!formik.errors.value}
                  errorText={formik.errors.value}
                >
                  <TimePickerInput
                    name="value"
                    onConfirm={(input) => {
                      formik.setFieldValue("value", input);
                    }}
                    inputValue={formik.values.value}
                    // withSeconds
                  />
                </Field>
              </form>
            </FieldsetRoot>
          </DisclosureBody>

          <DisclosureFooter>
            <BButton
              colorPalette={"red"}
              variant={"outline"}
              onClick={() => {
                back();
                formik.resetForm();
              }}
            >
              Discard
            </BButton>

            <BButton
              colorPalette={"p"}
              type="submit"
              form="update-rule-form"
              loading={loading}
            >
              Save
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

const Rules = () => {
  // Contexts
  const { rt } = useRenderTrigger();

  // States
  const { data, loading, error, makeRequest } = useDataState({
    url: `/rules/get`,
    payload: {},
    dependencies: [rt],
  });

  const rules = data?.ruleList;
  const sortedRules = rules?.sort((a: any, b: any) =>
    a.rulesType.localeCompare(b.rulesType)
  );

  return (
    <CContainer>
      <Heading5 fontWeight={"bold"} mb={2}>
        Rules
      </Heading5>

      {loading && <ComponentSpinner />}

      {!loading && (
        <>
          {error && <FeedbackRetry onRetry={makeRequest} />}

          {!error && sortedRules && (
            <HStack gap={4} align={"stretch"} wrap={"wrap"}>
              {sortedRules.map((item: any, i: number) => {
                return (
                  <CContainer
                    key={i}
                    p={4}
                    borderRadius={16}
                    bg={"body"}
                    gap={1}
                    flex={"1 1 240px"}
                  >
                    <HStack justify={"space-between"}>
                      <Text fontSize={18} fontWeight={"semibold"}>
                        {capsFirstLetter(item?.rulesType)}
                      </Text>

                      <UpdateRule item={item} />
                    </HStack>

                    <Text fontSize={20}>
                      {formatDuration(item?.value * 60, "numeric")}
                    </Text>
                  </CContainer>
                );
              })}
            </HStack>
          )}
        </>
      )}
    </CContainer>
  );
};

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
        <HStack p={2} bg={"body"} w={"fit"} borderRadius={8}>
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

        <HStack p={2} bg={"body"} w={"fit"} borderRadius={8}>
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

      <CContainer h={"400px"} p={4} pl={0} borderRadius={16} bg={"body"}>
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
        <HStack p={2} bg={"body"} w={"fit"} borderRadius={8}>
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

        <HStack p={2} bg={"body"} w={"fit"} borderRadius={8}>
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

      <CContainer h={"400px"} p={4} pl={0} borderRadius={16} bg={"body"}>
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
    <CContainer p={4} gap={8}>
      <Rules />

      <RevenueChart />

      <TotalTxsChart />
    </CContainer>
  );
};

export default DashboardPage;
