import {
  Grid,
  Input,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Anchor,
  Box,
  Group,
  Pagination,
  LoadingOverlay,
  Image,
  HoverCard,
  Center,
  rem,
  AspectRatio,
  Overlay,
} from "@mantine/core";
import ElementWrapper from "./ElementWrapper";
import { Grid as GiphyGrid } from "@giphy/react-components";

import {
  elementsConfig,
  GroupElement,
  TYPE_IMAGE_BUBBLE_ELEMENT,
} from "@webble/elements";
import { updateGroupElement } from "~/components/collect/store";
import { useCallback, useEffect, useState } from "react";
import { useFetcher, useParams } from "@remix-run/react";
import { UnsplashData } from "~/routes/api.unsplash";
import { useDebouncedValue } from "@mantine/hooks";
import "@mantine/dropzone/styles.css";
import { Dropzone } from "@mantine/dropzone";
import { IconMusicUp, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

function AudioBubbleElement(
  element: GroupElement<typeof TYPE_IMAGE_BUBBLE_ELEMENT>,
) {
  const [fileSource, setFileSource] = useState("Upload");

  const uploadFetcher = useFetcher<
    | { success: true; url: string; key: string }
    | { success: false; url: null; message: string }
  >();

  const params = useParams();

  useEffect(() => {
    if (uploadFetcher.data?.success && uploadFetcher.data?.url) {
      updateGroupElement<typeof element.type>({
        ...element,
        data: {
          ...element.data,
          url: uploadFetcher.data.url,
        },
      });
    }
  }, [uploadFetcher.data?.url]);

  return (
    <ElementWrapper
      icon={elementsConfig[element.type].icon}
      groupId=""
      element={element}
      configEl={
        <>
          <Stack gap="sm">
            <Stack>
              <SegmentedControl
                fullWidth
                value={fileSource}
                onChange={(source) => setFileSource(source)}
                withItemsBorders={false}
                data={["Link", "Upload"]}
              />
              {fileSource === "Upload" && (
                <>
                  <Dropzone
                    maxFiles={1}
                    loading={uploadFetcher.state !== "idle"}
                    onDrop={(files) => {
                      for (const file of files) {
                        const formData = new FormData();
                        formData.append("formId", params.formId || "");
                        formData.append("elementId", element.id);
                        formData.append("file", file);
                        uploadFetcher.submit(formData, {
                          method: "POST",
                          action: `/api/upload-image`,
                          encType: "multipart/form-data",
                        });
                      }
                    }}
                    onReject={(files) => console.log("rejected files", files)}
                    maxSize={5 * 1024 ** 2}
                    accept={["audio/*"]}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      mih={120}
                      style={{ pointerEvents: "none" }}
                    >
                      <Dropzone.Accept>
                        <IconUpload
                          style={{
                            width: rem(52),
                            height: rem(52),
                            color: "var(--mantine-color-blue-6)",
                          }}
                          stroke={1.5}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX
                          style={{
                            width: rem(52),
                            height: rem(52),
                            color: "var(--mantine-color-red-6)",
                          }}
                          stroke={1.5}
                        />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconMusicUp
                          style={{
                            width: rem(52),
                            height: rem(52),
                            color: "var(--mantine-color-dimmed)",
                          }}
                          stroke={1.5}
                        />
                      </Dropzone.Idle>

                      <div>
                        <Text size="xl" inline>
                          Drag audio file here or click to select file
                        </Text>
                        <Text ta={"center"} size="sm" c="dimmed" inline mt={7}>
                          File should not exceed 5mb
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                </>
              )}

              {fileSource === "Link" && (
                <>
                  <TextInput
                    label="Audio URL"
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
                </>
              )}
            </Stack>
          </Stack>
        </>
      }
    >
      {element.data.url ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio
          src={element.data.url}
          draggable={"false"}
          style={{ width: "100%", borderRadius: "4px" }}
          controls
        ></audio>
      ) : (
        <Text c={"gray"}>No image specified</Text>
      )}
    </ElementWrapper>
  );
}

export default AudioBubbleElement;
