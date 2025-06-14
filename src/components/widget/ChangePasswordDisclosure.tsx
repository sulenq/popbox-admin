import useChangePasswordDisclosure from "@/context/useChangePasswordDisclosure";
import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import { useFormik } from "formik";
import * as yup from "yup";
import BButton from "../ui-custom/BButton";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "../ui-custom/Disclosure";
import DisclosureHeaderContent from "../ui-custom/DisclosureHeaderContent";
import { Field } from "../ui/field";
import { FieldsetRoot } from "@chakra-ui/react";
import PasswordInput from "../ui-custom/PasswordInput";

const ChangePasswordDisclosure = () => {
  // Contexts
  const { l } = useLang();

  // Hooks
  const { req, loading } = useRequest({
    id: "change-password",
  });

  // Contexts
  const { changePasswordOpen, onOpen, onClose } = useChangePasswordDisclosure();
  useBackOnClose("change-passworod", changePasswordOpen, onOpen, onClose);

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: yup.object().shape({
      oldPassword: yup.string().required(l.required_form),
      newPassword: yup.string().required(l.required_form),
    }),
    onSubmit: (values) => {
      console.log(values);

      const payload = {
        id: 1,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      const config = {
        url: `/users/change-password`,
        method: "post",
        data: payload,
      };

      req({ config });
    },
  });

  return (
    <DisclosureRoot open={changePasswordOpen} lazyLoad size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`Change Password`} />
        </DisclosureHeader>

        <DisclosureBody>
          <FieldsetRoot disabled={loading}>
            <form id="change-password" onSubmit={formik.handleSubmit}>
              <Field
                label="Old Password"
                invalid={!!formik.errors.oldPassword}
                errorText={formik.errors.oldPassword}
                mb={4}
              >
                <PasswordInput
                  name="oldPassword"
                  onChangeSetter={(input: string | undefined) => {
                    formik.setFieldValue("oldPassword", input);
                  }}
                  inputValue={formik.values.oldPassword}
                  placeholder="********"
                />
              </Field>

              <Field
                label="New Password"
                invalid={!!formik.errors.newPassword}
                errorText={formik.errors.newPassword}
              >
                <PasswordInput
                  name="newPassword"
                  onChangeSetter={(input: string | undefined) => {
                    formik.setFieldValue("newPassword", input);
                  }}
                  inputValue={formik.values.newPassword}
                  placeholder="********"
                />
              </Field>
            </form>
          </FieldsetRoot>
        </DisclosureBody>

        <DisclosureFooter>
          <BButton
            type="submit"
            form="change-password"
            colorPalette={"p"}
            loading={loading}
          >
            Save
          </BButton>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};

export default ChangePasswordDisclosure;
