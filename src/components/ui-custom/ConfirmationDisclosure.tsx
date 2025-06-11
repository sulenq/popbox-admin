import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { ButtonProps, StackProps, Text, useDisclosure } from "@chakra-ui/react";
import BackButton from "./BackButton";
import BButton from "./BButton";
import CContainer from "./CContainer";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "./Disclosure";
import DisclosureHeaderContent from "./DisclosureHeaderContent";

interface Props {
  id: string;
  title: string;
  description: string;
  confirmLabel: string;
  confirmCallback: () => void;
  confirmButtonProps?: ButtonProps;
  children?: any;
  triggerProps?: StackProps;
  disabled?: boolean;
  loading?: boolean;
}

const ConfirmationDisclosure = ({
  id,
  title = "Judul",
  description = "Deskripsi",
  confirmLabel = "Label Konfirmasi",
  confirmCallback = () => {},
  confirmButtonProps,
  children,
  triggerProps,
  disabled = false,
  loading,
}: Props) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`confirm-${title}-${id}`, open, onOpen, onClose);

  return (
    <>
      <CContainer
        w={"unset"}
        onClick={disabled ? undefined : onOpen}
        {...triggerProps}
      >
        {children}
      </CContainer>

      <DisclosureRoot open={open} size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${title}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <Text>{description}</Text>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton disabled={loading} />
            <BButton
              onClick={confirmCallback}
              loading={loading}
              colorPalette={themeConfig.colorPalette}
              {...confirmButtonProps}
            >
              {confirmLabel}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

export default ConfirmationDisclosure;
