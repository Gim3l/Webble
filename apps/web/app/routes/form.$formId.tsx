import { Box, Flex } from "@mantine/core";
import { useParams } from "@remix-run/react";
import "~/styles/global.css";

export default function WebbleForm() {
  const params = useParams();
  return (
    <Flex px={4} justify={"center"}>
      <Box w={{ sm: "100vw", md: "50vw" }}>
        <webble-chatbox formId={params.formId}></webble-chatbox>
      </Box>
    </Flex>
  );
}
