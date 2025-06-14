import CContainer from "@/components/ui-custom/CContainer";
import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import DateRangePickerInput from "@/components/ui-custom/DateRangePickerInput";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import FeedbackRetry from "@/components/ui-custom/FeedbackRetry";
import Heading6 from "@/components/ui-custom/Heading6";
import SelectInput from "@/components/ui-custom/SelectInput";
import TableComponent from "@/components/ui-custom/TableComponent";
import { Interface__Select } from "@/constants/interfaces";
import { Type__DateRange } from "@/constants/types";
import useDataState from "@/hooks/useDataState";
import useRenderTrigger from "@/hooks/useRenderTrigger";
import useRequest from "@/hooks/useRequest";
import formatDate from "@/utils/formatDate";
import formatNumber from "@/utils/formatNumber";
import getThisMonthDateRange from "@/utils/getThisMonthDateRange";
import { Badge, Center, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const SelectProduct = (props: Interface__Select) => {
  const { ...restProps } = props;

  // States
  const { data } = useDataState({
    url: `/products/get-public`,
  });

  const options = data?.productList?.map((item: any) => ({
    value: item.productCode,
    label: item.productName,
  }));

  function fetch(setOptions: any) {
    setOptions(options);
  }

  return <SelectInput fetch={fetch} title="Product" w={"fit"} {...restProps} />;
};

const DataTable = (props: any) => {
  // Props
  const { data, limit, offset, setLimit, setOffset, totalData } = props;

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
          last_page: totalData / limit,
        },
      }}
      overflowY={"auto"}
      maxH={"calc(100dvh - 216px)"}
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
  const [product, setProduct] = useState<any>(null);
  const [limit, setLimit] = useState<any>(10);
  const [offset, setOffset] = useState<any>(0);
  const [totalData, setTotalData] = useState(0);

  // Utils
  function fetch() {
    const payload = {
      limit: limit,
      offset: offset,
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
      productCode: product?.value || "",
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
          setTotalData(r.data.result.totalData);
        },
      },
    });
  }

  useEffect(() => {
    fetch();
  }, [rt, limit, offset]);

  return (
    <CContainer p={4} pt={0} align={"center"} flex={1} overflowY={"auto"}>
      {loading && <ComponentSpinner />}

      {!loading && (
        <>
          {error && <FeedbackRetry onRetry={fetch} />}

          {!error && (
            <CContainer borderRadius={16} bg={"body"} pb={4} overflowY={"auto"}>
              <HStack
                p={4}
                borderBottom={"1px solid {colors.border.subtle}"}
                justify={"space-between"}
                overflowX={"auto"}
                flexShrink={0}
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

                  <SelectProduct
                    onConfirm={(input) => setProduct(input)}
                    value={product}
                    minW={"120px"}
                  />
                </HStack>
              </HStack>

              {data && (
                <DataTable
                  data={data}
                  limit={limit}
                  offset={offset}
                  setLimit={setLimit}
                  setOffset={setOffset}
                  pagination={totalData}
                />
              )}

              {!data && (
                <Center flex={1} p={10}>
                  <FeedbackNoData />
                </Center>
              )}
            </CContainer>
          )}
        </>
      )}
    </CContainer>
  );
};

export default TransactionPage;
