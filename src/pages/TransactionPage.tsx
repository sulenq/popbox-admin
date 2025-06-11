import CContainer from "@/components/ui-custom/CContainer";
import Heading1 from "@/components/ui-custom/Heading1";
import { IMAGES_PATH } from "@/constants/paths";
import { Image } from "@chakra-ui/react";

// const DataTable = (props: any) => {
//   // Props
//   const { data, limit, offset, setLimit, setOffset } = props;

//   // Hooks
//   const { req, loading } = useRequest({ id: "delete-product" });

//   // Contexts
//   const setEditProductOpen = useEditProductDisclosure(
//     (s) => s.setEditProductOpen
//   );
//   const setEditProductData = useEditProductDisclosure(
//     (s) => s.setEditProductData
//   );

//   // States
//   const ths = [
//     {
//       th: "Product Name",
//       sortable: true,
//     },
//     {
//       th: "Product Code",
//       sortable: true,
//     },
//     {
//       th: "Price",
//       sortable: true,
//       wrapperProps: {
//         justify: "end",
//       },
//     },
//     {
//       th: "Qty",
//       sortable: true,
//       wrapperProps: {
//         justify: "center",
//       },
//     },
//     {
//       th: "Grand Total",
//       sortable: true,
//       wrapperProps: {
//         justify: "end",
//       },
//     },
//     {
//       th: "Transaction Date",
//       sortable: true,
//     },
//     {
//       th: "Status",
//       sortable: true,
//       wrapperProps: {
//         justify: "center",
//       },
//     },
//   ];
//   const tds = data.map((item: any) => ({
//     id: item.id,
//     item: item,
//     columnsFormat: [
//       {
//         value: item.productName,
//         td: item.productName,
//       },
//       {
//         td: (
//           <CContainer w={"fit"}>
//             <Image
//               src={item?.productPhoto}
//               h={"50px"}
//               w={"fit"}
//               mx={"auto"}
//               cursor={"pointer"}
//               onClick={() => window.open(item?.productPhoto, "_blank")}
//             />
//           </CContainer>
//         ),
//         wrapperProps: {
//           justify: "center",
//         },
//       },
//       {
//         value: item.productCode,
//         td: item.productCode,
//       },
//       {
//         value: item.productPrice,
//         td: `Rp ${formatNumber(item.productPrice)}`,
//         cProps: {
//           justify: "end",
//         },
//       },
//       {
//         value: item.createdAt,
//         td: formatDate(item.createdAt),
//         dataType: "date",
//       },
//     ],
//   }));
//   const rowOptions = [
//     {
//       label: "Edit",
//       callback: (rowData: any) => {
//         setEditProductOpen(true);
//         setEditProductData(rowData);
//       },
//     },
//     {
//       label: "Delete",
//       confirmation: (rowData: any) => {
//         return {
//           id: "delete-product",
//           title: "Delete Product",
//           description: "Are you sure you want to delete this product ?",
//           confirmLabel: "Delete",
//           confirmCallback: () => {
//             deleteProduct(rowData.id);
//           },
//           loading: loading,
//         };
//       },
//       menuItemProps: {
//         color: "red.400",
//       },
//     },
//   ];

//   // Utils
//   function deleteProduct(id: any) {
//     const payload = {
//       id: id,
//     };

//     const config = {
//       url: "/product/delete",
//       method: "post",
//       data: payload,
//     };

//     req({ config });
//   }

//   return (
//     <TableComponent
//       originalData={data}
//       ths={ths}
//       tds={tds}
//       rowOptions={rowOptions}
//       limitControl={limit}
//       setLimitControl={setLimit}
//       pageControl={offset + 1}
//       setPageControl={setOffset}
//       pagination={{
//         meta: {
//           last_page: Math.ceil(data.length / limit),
//         },
//       }}
//     />
//   );
// };

const TransactionPage = () => {
  // Hooks
  // const { req, loading, error } = useRequest({
  //   id: "get-product",
  //   showSuccessToast: false,
  //   showLoadingToast: false,
  // });
  // const { rt } = useRenderTrigger();

  // States
  // const [data, setData] = useState<any>(null);
  // const [limit, setLimit] = useState<any>(10);
  // const [offset, setOffset] = useState<any>(0);

  // Utils
  // function fetch() {
  //   const payload = {
  //     limit: 10,
  //     offset: 0,
  //   };
  //   const config = {
  //     url: "/products/get",
  //     method: "post",
  //     data: payload,
  //   };

  //   req({
  //     config,
  //     onResolve: {
  //       onSuccess: (r) => {
  //         setData(r.data.result.productList);
  //       },
  //     },
  //   });
  // }

  // useEffect(() => {
  //   fetch();
  // }, [rt, limit, offset]);

  return (
    <CContainer p={4} pt={0} align={"center"} flex={1}>
      <Heading1 m={"auto"} mt={8} textAlign={"center"}>
        BE nya dlogok, API nya ga ada, desain gapernah dilihat, business logic
        pah poh, mines jatah bayaran
      </Heading1>
      <Image src={`${IMAGES_PATH}/dlogok.png`} mt={10} />
      {/* {loading && <ComponentSpinner />}

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
                  <DateRangePickerInput w={"fit"} />

                  <SearchInput />
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
      )} */}
    </CContainer>
  );
};

export default TransactionPage;
