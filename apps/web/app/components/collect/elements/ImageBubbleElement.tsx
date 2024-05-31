import { InputLabel, Stack, Text, TextInput } from "@mantine/core";
import ElementWrapper from "./ElementWrapper";

import {
  elementsConfig,
  GroupElement,
  TYPE_IMAGE_BUBBLE_ELEMENT,
} from "@webble/elements";
import { updateGroupElement } from "~/components/collect/store";

function ImageBubbleElement(
  element: GroupElement<typeof TYPE_IMAGE_BUBBLE_ELEMENT>,
) {
  return (
    <ElementWrapper
      icon={elementsConfig[element.type].icon}
      groupId=""
      element={element}
      configEl={
        <>
          <Stack gap="sm">
            <InputLabel>Image</InputLabel>

            <TextInput
              label="Image URL"
              defaultValue={element.data.url}
              placeholder="Enter URL"
              variant="filled"
              onChange={(e) => {
                updateGroupElement<typeof element.type>({
                  ...element,
                  data: {
                    ...element.data,
                    url: e.target.value,
                  },
                });
              }}
            />
          </Stack>
        </>
      }
    >
      {element.data.url ? (
        <img
          src={element.data.url}
          width={"100%"}
          alt={"Chat item"}
          draggable={"false"}
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      ) : (
        <Text c={"gray"}>No image specified</Text>
      )}
    </ElementWrapper>
  );
}

export default ImageBubbleElement;
