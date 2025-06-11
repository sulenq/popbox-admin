import { Spinner, SpinnerProps, StackProps, VStack } from "@chakra-ui/react";

interface Props extends StackProps {
  spinnerProps?: SpinnerProps;
}

export default function ComponentSpinner({ spinnerProps, ...props }: Props) {
  return (
    <VStack w={"full"} minH={"200px"} flex={1} justify={"center"} {...props}>
      <Spinner {...spinnerProps} />
    </VStack>
  );
}
