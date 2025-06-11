import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import FeedbackRetry from "@/components/ui-custom/FeedbackRetry";
import FileInput from "@/components/ui-custom/FileInput";
import Heading6 from "@/components/ui-custom/Heading6";
import NumberInput from "@/components/ui-custom/NumberInput";
import StringInput from "@/components/ui-custom/StringInput";
import TableComponent from "@/components/ui-custom/TableComponent";
import { Field } from "@/components/ui/field";
import useEditProductDisclosure from "@/context/useEditProductDisclosure";
import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import useRenderTrigger from "@/hooks/useRenderTrigger";
import useRequest from "@/hooks/useRequest";
import useScreen from "@/hooks/useScreen";
import back from "@/utils/back";
import fileToBase64 from "@/utils/fileToBase64";
import formatDate from "@/utils/formatDate";
import formatNumber from "@/utils/formatNumber";
import urlToBase64 from "@/utils/urlToBase64";
import {
  Circle,
  FieldsetRoot,
  HStack,
  Icon,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";

const DefaultTemplateInput = (props: any) => {
  // Props
  const { onChangeSetter, inputValue } = props;

  // Hooks
  const { sw } = useScreen();

  // States
  const { data, loading, error, makeRequest } = useDataState<any>({
    url: `/templates/get`,
  });

  return (
    <CContainer
      w={sw > 480 ? "480px" : "calc(100vw - 32px)"}
      overflowX={"auto"}
    >
      {loading && <ComponentSpinner />}

      {!loading && (
        <>
          {error && <FeedbackRetry onRetry={makeRequest} />}

          {!error && data && (
            <HStack w={"max"} gap={4}>
              {data?.map((item: any, i: number) => {
                const active = item.id === inputValue?.id;

                return (
                  <CContainer
                    key={i}
                    pos={"relative"}
                    cursor={"pointer"}
                    className="clicky"
                    onClick={() => {
                      onChangeSetter(item);
                    }}
                    opacity={inputValue ? (active ? 1 : 0.5) : 1}
                  >
                    {active && (
                      <Circle
                        p={2}
                        pos={"absolute"}
                        top={"50%"}
                        right={"50%"}
                        transform={"translate(50%, -50%)"}
                        bg={"white"}
                      >
                        <Icon color={"p.500"}>
                          <IconCheck stroke={3} />
                        </Icon>
                      </Circle>
                    )}

                    <Image src={`${item.display}`} w={"100px"} />
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

const AddProduct = () => {
  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose("add-product", open, onOpen, onClose);
  const { req, loading } = useRequest({ id: "add-product" });

  // Contexts
  const { l } = useLang();
  const { rt, setRt } = useRenderTrigger();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      productCode: "",
      productName: "",
      productPhoto: undefined as any,
      productPrice: undefined as any,
      defaultTemplate: undefined as any,
    },
    validationSchema: yup.object().shape({
      productCode: yup.string().required(l.required_form),
      productName: yup.string().required(l.required_form),
      productPhoto: yup.array().required(l.required_form),
      productPrice: yup.number().required(l.required_form),
      defaultTemplate: yup.object().required(l.required_form),
    }),
    onSubmit: async (values) => {
      console.log(values);
      const productPhoto = values.productPhoto?.[0];

      const payload = {
        productCode: values.productCode,
        productName: values.productName,
        productPhoto: productPhoto ? await fileToBase64(productPhoto) : null,
        productPrice: values.productPrice,
        defaultTemplateId: values.defaultTemplate?.id,
      };

      const config = {
        url: "/products/add",
        method: "post",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt(!rt);
          },
        },
      });
    },
  });

  return (
    <>
      <BButton
        pl={3}
        ml={"auto"}
        colorPalette={"p"}
        size={"sm"}
        onClick={onOpen}
      >
        <Icon>
          <IconPlus />
        </Icon>
        Add Product
      </BButton>

      <DisclosureRoot open={open} lazyLoad>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Add New Product`} />
          </DisclosureHeader>

          <DisclosureBody>
            <FieldsetRoot disabled={loading}>
              <form id={"add-product-form"} onSubmit={formik.handleSubmit}>
                <Field
                  label="Product Photo"
                  invalid={!!formik.errors.productPhoto}
                  errorText={formik.errors.productPhoto as string}
                  mb={4}
                >
                  <FileInput
                    dropzone
                    name="productPhoto"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("productPhoto", input);
                    }}
                    inputValue={formik.values.productPhoto}
                    placeholder="PK-001"
                  />
                </Field>

                <Field
                  label="Product Code"
                  invalid={!!formik.errors.productCode}
                  errorText={formik.errors.productCode as string}
                  mb={4}
                >
                  <StringInput
                    name="productCode"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("productCode", input);
                    }}
                    inputValue={formik.values.productCode}
                    placeholder="Photo Only"
                  />
                </Field>

                <Field
                  label="Product Name"
                  invalid={!!formik.errors.productName}
                  errorText={formik.errors.productName as string}
                  mb={4}
                >
                  <StringInput
                    name="productName"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("productName", input);
                    }}
                    inputValue={formik.values.productName}
                    placeholder="Photo Only"
                  />
                </Field>

                <Field
                  label="Price"
                  invalid={!!formik.errors.productPrice}
                  errorText={formik.errors.productPrice as string}
                  mb={4}
                >
                  <NumberInput
                    name="productPrice"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("productPrice", input);
                    }}
                    inputValue={formik.values.productPrice}
                    placeholder="30.000"
                  />
                </Field>

                <Field
                  label="Default Template"
                  invalid={!!formik.errors.defaultTemplate}
                  errorText={formik.errors.defaultTemplate as string}
                  mb={4}
                >
                  <DefaultTemplateInput
                    onChangeSetter={(input: any) => {
                      formik.setFieldValue("defaultTemplate", input);
                    }}
                    inputValue={formik.values.defaultTemplate}
                  />
                </Field>
              </form>
            </FieldsetRoot>
          </DisclosureBody>

          <DisclosureFooter>
            <BButton
              onClick={() => {
                back();
                formik.resetForm();
              }}
              variant={"outline"}
              colorPalette={"red"}
            >
              Discard
            </BButton>

            <BButton
              colorPalette={"p"}
              type="submit"
              form="add-product-form"
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

const EditProduct = () => {
  // Hooks
  const {
    editProductOpen,
    editProductData,
    editProductOnOpen,
    editProductOnClose,
  } = useEditProductDisclosure();
  useBackOnClose(
    "edit-product",
    editProductOpen,
    editProductOnOpen,
    editProductOnClose
  );
  const { req, loading } = useRequest({ id: "add-product" });

  // Contexts
  const { l } = useLang();
  const { rt, setRt } = useRenderTrigger();

  // States
  const item = useMemo(() => editProductData?.item, [editProductData]);
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      productCode: item?.productCode,
      productName: item?.productName,
      productPhoto: [item?.productPhoto] as any,
      productPrice: item?.productPrice,
      defaultTemplate: {
        id: item?.defaultTemplateId,
      },
    },
    validationSchema: yup.object().shape({
      productCode: yup.string().required(l.required_form),
      productName: yup.string().required(l.required_form),
      productPhoto: yup.array().required(l.required_form),
      productPrice: yup.number().required(l.required_form),
      defaultTemplate: yup.object().required(l.required_form),
    }),
    onSubmit: async (values) => {
      console.log(values);
      const productPhoto = values.productPhoto?.[0];

      const payload = {
        id: item?.id,
        productCode: values.productCode,
        productName: values.productName,
        productPhoto:
          productPhoto instanceof File
            ? await fileToBase64(productPhoto)
            : await urlToBase64(productPhoto),
        productPrice: values.productPrice,
        defaultTemplateId: values.defaultTemplate?.id,
      };

      const config = {
        url: "/products/update",
        method: "post",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt(!rt);
          },
        },
      });
    },
  });

  return (
    <DisclosureRoot open={editProductOpen} lazyLoad>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`Edit Detail Product`} />
        </DisclosureHeader>

        <DisclosureBody>
          <FieldsetRoot disabled={loading}>
            <form id={"update-product-form"} onSubmit={formik.handleSubmit}>
              <Field
                label="Product Photo"
                invalid={!!formik.errors.productPhoto}
                errorText={formik.errors.productPhoto as string}
                mb={4}
              >
                <FileInput
                  dropzone
                  name="productPhoto"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("productPhoto", input);
                  }}
                  inputValue={formik.values.productPhoto}
                  placeholder="PK-001"
                />
              </Field>

              <Field
                label="Product Code"
                invalid={!!formik.errors.productCode}
                errorText={formik.errors.productCode as string}
                mb={4}
              >
                <StringInput
                  name="productCode"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("productCode", input);
                  }}
                  inputValue={formik.values.productCode}
                  placeholder="Photo Only"
                />
              </Field>

              <Field
                label="Product Name"
                invalid={!!formik.errors.productName}
                errorText={formik.errors.productName as string}
                mb={4}
              >
                <StringInput
                  name="productName"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("productName", input);
                  }}
                  inputValue={formik.values.productName}
                  placeholder="Photo Only"
                />
              </Field>

              <Field
                label="Price"
                invalid={!!formik.errors.productPrice}
                errorText={formik.errors.productPrice as string}
                mb={4}
              >
                <NumberInput
                  name="productPrice"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("productPrice", input);
                  }}
                  inputValue={formik.values.productPrice}
                  placeholder="30.000"
                />
              </Field>

              <Field
                label="Default Template"
                invalid={!!formik.errors.defaultTemplate}
                errorText={formik.errors.defaultTemplate as string}
                mb={4}
              >
                <DefaultTemplateInput
                  onChangeSetter={(input: any) => {
                    formik.setFieldValue("defaultTemplate", input);
                  }}
                  inputValue={formik.values.defaultTemplate}
                />
              </Field>
            </form>
          </FieldsetRoot>
        </DisclosureBody>

        <DisclosureFooter>
          <BButton
            onClick={() => {
              back();
              formik.resetForm();
            }}
            variant={"outline"}
            colorPalette={"red"}
          >
            Discard
          </BButton>

          <BButton
            colorPalette={"p"}
            type="submit"
            form="update-product-form"
            loading={loading}
          >
            Save
          </BButton>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};

const DataTable = (props: any) => {
  // Props
  const { data, limit, offset, setLimit, setOffset } = props;

  // Hooks
  const { req, loading } = useRequest({ id: "delete-product" });

  // Contexts
  const setEditProductOpen = useEditProductDisclosure(
    (s) => s.setEditProductOpen
  );
  const setEditProductData = useEditProductDisclosure(
    (s) => s.setEditProductData
  );

  // States
  const ths = [
    {
      th: "Product Name",
      sortable: true,
    },
    {
      th: "Product Photo",
      wrapperProps: {
        justify: "center",
      },
    },
    {
      th: "Product Code",
      sortable: true,
    },
    {
      th: "Price",
      sortable: true,
      cProps: {
        justify: "end",
      },
    },
    {
      th: "Created At",
      sortable: true,
    },
  ];
  const tds = data.map((item: any) => ({
    id: item.id,
    item: item,
    columnsFormat: [
      {
        value: item.productName,
        td: item.productName,
      },
      {
        td: (
          <CContainer w={"fit"}>
            <Image
              src={item?.productPhoto}
              h={"50px"}
              w={"fit"}
              mx={"auto"}
              cursor={"pointer"}
              onClick={() => window.open(item?.productPhoto, "_blank")}
            />
          </CContainer>
        ),
        wrapperProps: {
          justify: "center",
        },
      },
      {
        value: item.productCode,
        td: item.productCode,
      },
      {
        value: item.productPrice,
        td: `Rp ${formatNumber(item.productPrice)}`,
        cProps: {
          justify: "end",
        },
      },
      {
        value: item.createdAt,
        td: formatDate(item.createdAt),
        dataType: "date",
      },
    ],
  }));
  const rowOptions = [
    {
      label: "Edit",
      callback: (rowData: any) => {
        setEditProductOpen(true);
        setEditProductData(rowData);
      },
    },
    {
      label: "Delete",
      confirmation: (rowData: any) => {
        return {
          id: "delete-product",
          title: "Delete Product",
          description: "Are you sure you want to delete this product ?",
          confirmLabel: "Delete",
          confirmCallback: () => {
            deleteProduct(rowData.id);
          },
          loading: loading,
        };
      },
      menuItemProps: {
        color: "red.400",
      },
    },
  ];

  // Utils
  function deleteProduct(id: any) {
    const payload = {
      id: id,
    };

    const config = {
      url: "/product/delete",
      method: "post",
      data: payload,
    };

    req({ config });
  }

  return (
    <TableComponent
      originalData={data}
      ths={ths}
      tds={tds}
      rowOptions={rowOptions}
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

const ProductPage = () => {
  // Hooks
  const { req, loading, error } = useRequest({
    id: "get-product",
    showSuccessToast: false,
    showLoadingToast: false,
  });
  const { rt } = useRenderTrigger();

  // States
  const [data, setData] = useState<any>(null);
  const [limit, setLimit] = useState<any>(10);
  const [offset, setOffset] = useState<any>(0);

  // Utils
  function fetch() {
    const payload = {
      limit: 10,
      offset: 0,
    };
    const config = {
      url: "/products/get",
      method: "post",
      data: payload,
    };

    req({
      config,
      onResolve: {
        onSuccess: (r) => {
          setData(r.data.result.productList);
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
              <HStack p={4} borderBottom={"1px solid {colors.border.subtle}"}>
                <Heading6 fontWeight={"bold"}>Setting Product</Heading6>

                <AddProduct />
              </HStack>

              <DataTable
                data={data}
                limit={limit}
                offset={offset}
                setLimit={setLimit}
                setOffset={setOffset}
              />

              <EditProduct />
            </CContainer>
          )}
        </>
      )}
    </CContainer>
  );
};

export default ProductPage;
