import {
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Group,
  rem,
} from "@mantine/core";
import ElementWrapper from "./ElementWrapper";

import {
  elementsConfig,
  generateVideoEmbed,
  parseVideoUrl,
  VideoBubbleGroupElement,
} from "@webble/elements";
import { updateGroupElement } from "~/components/collect/store";
import { useEffect, useState } from "react";
import { useFetcher, useParams } from "@remix-run/react";
import "@mantine/dropzone/styles.css";
import { Dropzone } from "@mantine/dropzone";
import { IconMusicUp, IconUpload, IconX } from "@tabler/icons-react";

function VideoBubbleElement(element: VideoBubbleGroupElement) {
  const params = useParams();

  return (
    <ElementWrapper
      icon={elementsConfig[element.type].icon}
      groupId=""
      element={element}
      configEl={
        <>
          <Stack gap="sm">
            <TextInput
              label="Video URL"
              defaultValue={element.data.url}
              placeholder="Enter URL"
              variant="filled"
              onChange={(e) => {
                updateGroupElement<VideoBubbleGroupElement>({
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
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <div
          dangerouslySetInnerHTML={{
            __html: generateVideoEmbed(parseVideoUrl(element.data.url)),
          }}
        ></div>
      ) : (
        <Text c={"gray"}>No video provided</Text>
      )}
    </ElementWrapper>
  );
}

export default VideoBubbleElement;
