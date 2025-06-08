import CContainer from "@/components/ui-custom/CContainer";
import { ColorModeButton } from "@/components/ui/color-mode";
import LoginForm from "@/components/widget/LoginForm";
import { IMAGES_PATH } from "@/constants/paths";
import { Image, SimpleGrid } from "@chakra-ui/react";

const RootPage = () => {
  return (
    <CContainer p={8} justify={"center"} minH={"100dvh"} bg={"bg.subtle"}>
      <SimpleGrid
        columns={[1, null, 2]}
        gap={8}
        borderRadius={16}
        p={4}
        bg={"body"}
        pos={"relative"}
        border={"1px solid {colors.border.subtle}"}
        maxW={"800px"}
        m={"auto"}
      >
        <ColorModeButton pos={"absolute"} right={4} top={4} />

        <CContainer>
          <Image src={`${IMAGES_PATH}/login.png`} />
        </CContainer>

        <LoginForm />
      </SimpleGrid>
    </CContainer>
  );
};

export default RootPage;
