import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import ConfirmationDisclosure from "@/components/ui-custom/ConfirmationDisclosure";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import FeedbackRetry from "@/components/ui-custom/FeedbackRetry";
import FileInput from "@/components/ui-custom/FileInput";
import Heading6 from "@/components/ui-custom/Heading6";
import SelectInput from "@/components/ui-custom/SelectInput";
import { Field } from "@/components/ui/field";
import { Interface__Select } from "@/constants/interfaces";
import { IMAGES_PATH } from "@/constants/paths";
import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import useRenderTrigger from "@/hooks/useRenderTrigger";
import useRequest from "@/hooks/useRequest";
import useScreen from "@/hooks/useScreen";
import back from "@/utils/back";
import {
  Center,
  Circle,
  FieldsetRoot,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

const SelectLayout = (props: any) => {
  // Props
  const { onChangeSetter, inputValue } = props;

  // Hooks
  const { sw } = useScreen();

  return (
    <CContainer
      w={sw > 480 ? "480px" : "calc(100vw - 32px)"}
      overflowX={"auto"}
    >
      <HStack w={"max"} gap={2}>
        {Array.from({ length: 7 }).map((_, i: number) => {
          const active = i + 1 === inputValue;

          return (
            <CContainer
              key={i}
              pos={"relative"}
              cursor={"pointer"}
              className="clicky"
              onClick={() => {
                onChangeSetter(i + 1);
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

              <Image src={`${IMAGES_PATH}/layouts/${i + 1}.png`} w={"200px"} />
            </CContainer>
          );
        })}
      </HStack>
    </CContainer>
  );
};

const SelectProduct = (props: Interface__Select) => {
  const { ...restProps } = props;

  // States
  const { data } = useDataState({
    url: `/products/get-public`,
  });

  const options = data?.productList?.map((item: any) => ({
    value: item.id,
    label: item.productName,
  }));

  function fetch(setOptions: any) {
    setOptions(options);
  }

  return <SelectInput fetch={fetch} title="Product" {...restProps} />;
};

const AddTemplate = () => {
  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose("add-template", open, onOpen, onClose);
  const { req, loading } = useRequest({ id: "add-template" });

  // Contexts
  const { l } = useLang();
  const { rt, setRt } = useRenderTrigger();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      layoutId: undefined as any,
      productCategory: undefined as any,
      display: undefined as any,
      production: undefined as any,
    },
    validationSchema: yup.object().shape({
      layoutId: yup.number().required(l.required_form),
      productCategory: yup.array().required(l.required_form),
      display: yup.array().required(l.required_form),
      production: yup.array().required(l.required_form),
    }),
    onSubmit: (values) => {
      console.log(values);
      const display = values.display?.[0];
      const production = values.production?.[0];

      const formData = new FormData();
      formData.append("layoutId", values.layoutId);
      formData.append("productId", values.productCategory?.[0]?.value || "");

      if (display) {
        formData.append("display", display);
      }

      if (production) {
        formData.append("production", production);
      }

      const config = {
        url: "/templates/add-template",
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            back();
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
        Add Template
      </BButton>

      <DisclosureRoot open={open} lazyLoad>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Add New Product`} />
          </DisclosureHeader>

          <DisclosureBody>
            <FieldsetRoot disabled={loading}>
              <form id={"add-template-form"} onSubmit={formik.handleSubmit}>
                <SimpleGrid gap={4} columns={[1, null, 2]}>
                  <Field
                    label="Display"
                    invalid={!!formik.errors.display}
                    errorText={formik.errors.display as string}
                    mb={4}
                  >
                    <FileInput
                      dropzone
                      name="display"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("display", input);
                      }}
                      inputValue={formik.values.display}
                      placeholder="PK-001"
                    />
                  </Field>

                  <Field
                    label="Template"
                    invalid={!!formik.errors.production}
                    errorText={formik.errors.production as string}
                    mb={4}
                  >
                    <FileInput
                      dropzone
                      name="production"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("production", input);
                      }}
                      inputValue={formik.values.production}
                      placeholder="PK-001"
                    />
                  </Field>
                </SimpleGrid>

                <Field
                  label="Layout"
                  invalid={!!formik.errors.layoutId}
                  errorText={formik.errors.layoutId as string}
                  mb={4}
                >
                  <SelectLayout
                    onChangeSetter={(input: any) => {
                      formik.setFieldValue("layoutId", input);
                    }}
                    inputValue={formik.values.layoutId}
                  />
                </Field>

                <Field
                  label="Product Category"
                  invalid={!!formik.errors.display}
                  errorText={formik.errors.display as string}
                  mb={4}
                >
                  <SelectProduct
                    onConfirm={(input) => {
                      formik.setFieldValue("productCategory", input);
                    }}
                    inputValue={formik.values.productCategory}
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
              form="add-template-form"
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

const TemplateItem = (props: any) => {
  // Props
  const { item } = props;

  // Hooks
  const { req, loading } = useRequest({ id: "delete-template" });

  // Contexts
  const { rt, setRt } = useRenderTrigger();

  // Utils
  function deleteTemplate(id: any) {
    const payload = {
      id: id,
    };

    const config = {
      url: "/templates/delete",
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
  }

  return (
    <CContainer pos={"relative"}>
      <ConfirmationDisclosure
        id={`delete-template-${item.id}`}
        title="Delete Your Template?"
        description="Think it through! Deleting this product can't be undone. Are you sure?"
        confirmLabel="Yes, Go Ahead"
        confirmCallback={() => {
          deleteTemplate(item.id);
        }}
      >
        <BButton
          iconButton
          pos={"absolute"}
          top={2}
          right={2}
          colorPalette={"red"}
          loading={loading}
        >
          <Icon>
            <IconTrash />
          </Icon>
        </BButton>
      </ConfirmationDisclosure>

      <Image src={item?.display} />
    </CContainer>
  );
};

const DataList = (props: any) => {
  // Props
  const { data } = props;

  return (
    <CContainer p={4} pb={0}>
      <SimpleGrid columns={[1, 2, 3, 4]} gap={6}>
        {data.map((item: any, i: number) => {
          return <TemplateItem key={i} item={item} />;
        })}
      </SimpleGrid>
    </CContainer>
  );
};

const TemplatePage = () => {
  // Hooks
  const { req, loading, error } = useRequest({
    id: "get-template",
    showSuccessToast: false,
    showLoadingToast: false,
  });
  const { rt } = useRenderTrigger();

  // States
  const [data, setData] = useState<any>(null);

  // Utils
  function fetch() {
    const config = {
      url: "/templates/get",
    };

    req({
      config,
      onResolve: {
        onSuccess: (r) => {
          setData(r.data.result);
        },
      },
    });
  }

  useEffect(() => {
    fetch();
  }, [rt]);

  return (
    <CContainer p={4} pt={0} align={"center"} flex={1}>
      {loading && <ComponentSpinner />}

      {!loading && (
        <>
          {error && <FeedbackRetry onRetry={fetch} />}

          {!error && (
            <>
              <CContainer
                borderRadius={16}
                bg={"body"}
                pb={4}
                flex={data ? 0 : 1}
              >
                <HStack p={4} borderBottom={"1px solid {colors.border.subtle}"}>
                  <Heading6 fontWeight={"bold"}>Setting Template</Heading6>

                  <AddTemplate />
                </HStack>

                {data && <DataList data={data} />}

                {!data && (
                  <Center flex={1} p={10}>
                    <FeedbackNoData />
                  </Center>
                )}
              </CContainer>
            </>
          )}
        </>
      )}
    </CContainer>
  );
};

export default TemplatePage;
