import CContainer from "@/components/ui-custom/CContainer";
import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import DateRangePickerInput from "@/components/ui-custom/DateRangePickerInput";
import FeedbackRetry from "@/components/ui-custom/FeedbackRetry";
import Heading6 from "@/components/ui-custom/Heading6";
import TableComponent from "@/components/ui-custom/TableComponent";
import { Type__DateRange } from "@/constants/types";
import useRenderTrigger from "@/hooks/useRenderTrigger";
import useRequest from "@/hooks/useRequest";
import formatDate from "@/utils/formatDate";
import formatNumber from "@/utils/formatNumber";
import getThisMonthDateRange from "@/utils/getThisMonthDateRange";
import { Badge, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const DataTable = (props: any) => {
  // Props
  const { data, limit, offset, setLimit, setOffset } = props;

  // States
  const ths = [
    {
      th: "Invoice Number",
      sortable: true,
    },
    {
      th: "Product Name",
      sortable: true,
    },
    {
      th: "Product Code",
      sortable: true,
    },
    {
      th: "Price",
      sortable: true,
      wrapperProps: {
        justify: "end",
      },
    },
    {
      th: "Qty",
      sortable: true,
      wrapperProps: {
        justify: "center",
      },
    },
    {
      th: "Grand Total",
      sortable: true,
      wrapperProps: {
        justify: "end",
      },
    },
    {
      th: "Transaction Date",
      sortable: true,
    },
    {
      th: "Status",
      sortable: true,
      wrapperProps: {
        justify: "center",
      },
    },
  ];
  const tds = data.map((item: any) => ({
    id: item.id,
    item: item,
    columnsFormat: [
      {
        value: item.invoiceNumber,
        td: item.invoiceNumber,
      },
      {
        value: item.productName,
        td: item.productName,
      },
      {
        value: item.productCode,
        td: item.productCode,
      },
      {
        value: item.productPrice,
        td: `Rp ${formatNumber(item.price)}`,
        dataType: "number",
        wrapperProps: {
          justify: "end",
        },
      },
      {
        value: item.qty,
        td: formatNumber(item.qty),
        dataType: "number",
        wrapperProps: {
          justify: "center",
        },
      },
      {
        value: item.grandTotal,
        td: `Rp ${formatNumber(item.grandTotal)}`,
        dataType: "number",
        wrapperProps: {
          justify: "end",
        },
      },
      {
        value: item.transactionDate,
        td: formatDate(item.transactionDate),
        dataType: "date",
      },
      {
        value: item.status,
        td: (
          <Badge colorPalette={item.status === "SUCCESS" ? "green" : "red"}>
            {item.status}
          </Badge>
        ),
        dataType: "number",
        wrapperProps: {
          justify: "center",
        },
      },
    ],
  }));

  return (
    <TableComponent
      originalData={data}
      ths={ths}
      tds={tds}
      limitControl={limit}
      setLimitControl={setLimit}
      pageControl={offset + 1}
      setPageControl={setOffset}
      pagination={{
        meta: {
          last_page: Math.ceil(data.length / limit),
        },
      }}
    />
  );
};

const TransactionPage = () => {
  // Hooks
  const { req, loading, error } = useRequest({
    id: "get-txs",
    showSuccessToast: false,
    showLoadingToast: false,
  });
  const { rt } = useRenderTrigger();

  // States
  const [data, setData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<Type__DateRange>(
    getThisMonthDateRange()
  );
  const [limit, setLimit] = useState<any>(10);
  const [offset, setOffset] = useState<any>(0);

  // Utils
  function fetch() {
    const payload = {
      limit: 10,
      offset: 0,
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
    };
    const config = {
      url: "/transactions/get-list",
      method: "post",
      data: payload,
    };

    req({
      config,
      onResolve: {
        onSuccess: (r) => {
          setData(r.data.result.trxList);
        },
      },
    });
  }

  useEffect(() => {
    fetch();
  }, [rt, limit, offset]);

  return (
    <CContainer p={4} pt={0} align={"center"} flex={1}>
      {loading && <ComponentSpinner />}

      {!loading && (
        <>
          {error && <FeedbackRetry onRetry={fetch} />}

          {!error && data && (
            <CContainer borderRadius={16} bg={"body"} pb={4}>
              <HStack
                p={4}
                borderBottom={"1px solid {colors.border.subtle}"}
                justify={"space-between"}
              >
                <Heading6 fontWeight={"bold"}>Report Transaction</Heading6>

                <HStack>
                  <DateRangePickerInput
                    w={"fit"}
                    onConfirm={(input) => {
                      setDateRange(input);
                    }}
                    inputValue={dateRange}
                    nonNullable
                  />
                </HStack>
              </HStack>

              <DataTable
                data={data}
                limit={limit}
                offset={offset}
                setLimit={setLimit}
                setOffset={setOffset}
              />
            </CContainer>
          )}
        </>
      )}
    </CContainer>
  );
};

export default TransactionPage;
