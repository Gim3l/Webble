import { Box, Flex } from "@mantine/core";
import "~/styles/global.css";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getForm } from "~/queries/form.queries";
import { dbClient } from "~/lib/db";
import { useParams } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  const form = await getForm.run(dbClient, { id: params.formId as string });

  if (!form?.published) throw json({}, { status: 404 });

  return json({});
}

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

export function shouldRevalidate({ defaultShouldRevalidate }) {
  // if (whateverConditionsYouCareAbout) {
  //   return false;
  // }

  return false;
}
