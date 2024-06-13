import { Stack, Text, Textarea } from "@mantine/core";
import ElementWrapper from "./ElementWrapper";

import { elementsConfig, EmbedBubbleGroupElement } from "@webble/elements";
import { updateGroupElement } from "~/components/collect/store";
import "@mantine/dropzone/styles.css";

function VideoBubbleElement(element: EmbedBubbleGroupElement) {
  return (
    <ElementWrapper
      icon={elementsConfig[element.type].icon}
      groupId=""
      element={element}
      configEl={
        <>
          <Stack gap="sm">
            <Textarea
              label="URL / Code"
              autosize
              defaultValue={element.data.code}
              minRows={2}
              maxRows={10}
              placeholder="Enter iframe code or a website URL"
              variant="filled"
              onChange={(e) => {
                updateGroupElement<EmbedBubbleGroupElement>({
                  ...element,
                  data: {
                    ...element.data,
                    code: e.target.value.trimStart(),
                  },
                });
              }}
            />
          </Stack>
        </>
      }
    >
      {element.data.code ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <Text>Click to see view code</Text>
      ) : (
        <Text c={"gray"}>No code provided</Text>
      )}
    </ElementWrapper>
  );
}

export default VideoBubbleElement;
