import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import NavLink from "@/components/ui-custom/NavLink";
import { Avatar } from "@/components/ui/avatar";
import { ColorModeButton } from "@/components/ui/color-mode";
import LoginForm from "@/components/widget/LoginForm";
import { IMAGES_PATH } from "@/constants/paths";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import { Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";

const RootPage = () => {
  const authToken = useAuthMiddleware((s) => s.authToken);

  return (
    <CContainer
      p={8}
      justify={"center"}
      align={"center"}
      minH={"100dvh"}
      bg={"bg.subtle"}
    >
      <SimpleGrid
        columns={[1, null, 2]}
        gap={8}
        borderRadius={16}
        p={4}
        bg={"body"}
        border={"1px solid {colors.border.subtle}"}
        maxW={"800px"}
      >
        <CContainer>
          <Image src={`${IMAGES_PATH}/login.png`} w={"full"} />
        </CContainer>

        <CContainer justify={"center"} pos={"relative"}>
          <ColorModeButton pos={"absolute"} right={0} top={0} />

          {!authToken && <LoginForm />}

          {authToken && (
            <VStack gap={4}>
              <Avatar size={"2xl"} />

              <VStack gap={0}>
                <Text fontWeight={"semibold"}>Admin PopBox</Text>
                <Text>popboxadmin</Text>
              </VStack>

              <NavLink to="/dashboard" w={"fit"}>
                <BButton colorPalette={"p"} w={"fit"}>
                  Go to Dashboard
                </BButton>
              </NavLink>
            </VStack>
          )}
        </CContainer>
      </SimpleGrid>
    </CContainer>
  );
};

export default RootPage;
