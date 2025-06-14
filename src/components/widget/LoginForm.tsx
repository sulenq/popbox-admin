import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { FieldsetRoot, Text } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import Heading6 from "../ui-custom/Heading6";
import PasswordInput from "../ui-custom/PasswordInput";
import StringInput from "../ui-custom/StringInput";
import { Field } from "../ui/field";

const LoginForm = () => {
  // Contexts
  const { l } = useLang();
  const setAuthToken = useAuthMiddleware((s) => s.setAuthToken);
  const { themeConfig } = useThemeConfig();
  const { req, loading } = useRequest({
    id: "login",
    loadingMessage: {
      ...l.login_loading_toast,
    },
    successMessage: {
      ...l.login_success_toast,
    },
    errorMessage: {
      400: {
        WRONG_CREDENTIALS: {
          ...l.login_wrong_credentials_toast,
        },
      },
    },
  });

  // Utils
  const navigate = useNavigate();

  // Formik
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      identifier: yup.string().required(l.required_form),
      password: yup.string().required(l.required_form),
    }),
    onSubmit: (values) => {
      const token = btoa(`photobox:PhotoBox123@`);
      const payload = {
        username: values.identifier,
        password: values.password,
      };
      const config = {
        method: "post",
        url: "/users/login",
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/json",
        },
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            localStorage.setItem("__auth_token", r.data.result);
            // localStorage.setItem("__user_data", r.data.data?.user);
            setAuthToken(r.data.token);
            navigate("/dashboard");
          },
        },
      });
    },
  });

  return (
    <CContainer
      bg={"body"}
      maxW={"380px"}
      p={4}
      borderRadius={8}
      justify={"center"}
    >
      <FieldsetRoot disabled={loading}>
        <CContainer mb={4} gap={1}>
          <Heading6 fontWeight={"bold"}>{l.login_form.title}</Heading6>
          <Text fontSize={"sm"}>{l.login_form.description}</Text>
        </CContainer>

        <form id="login-form" onSubmit={formik.handleSubmit}>
          <Field
            label="Email/Username"
            invalid={!!formik.errors.identifier}
            errorText={formik.errors.identifier}
            mb={4}
          >
            <StringInput
              name="identifier"
              onChangeSetter={(input) => {
                formik.setFieldValue("identifier", input);
              }}
              inputValue={formik.values.identifier}
              placeholder="example@email.com"
            />
          </Field>

          <Field
            label="Password"
            invalid={!!formik.errors.password}
            errorText={formik.errors.password}
          >
            <PasswordInput
              name="password"
              onChangeSetter={(input) => {
                formik.setFieldValue("password", input);
              }}
              inputValue={formik.values.password}
              placeholder="********"
            />
          </Field>

          {/* <HStack mt={4}>
            <TextRouterLink to="/">{l.forgot_password}</TextRouterLink>
          </HStack> */}

          <BButton
            type="submit"
            form="login-form"
            w={"full"}
            mt={6}
            size={"lg"}
            loading={loading}
            colorPalette={themeConfig.colorPalette}
          >
            Login
          </BButton>
        </form>
      </FieldsetRoot>
    </CContainer>
  );
};

export default LoginForm;
