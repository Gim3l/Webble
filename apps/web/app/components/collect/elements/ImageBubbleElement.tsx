import {
  Grid,
  Input,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Anchor,
} from "@mantine/core";
import ElementWrapper from "./ElementWrapper";

import {
  elementsConfig,
  GroupElement,
  TYPE_IMAGE_BUBBLE_ELEMENT,
} from "@webble/elements";
import { updateGroupElement } from "~/components/collect/store";
import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { UnsplashLoaderData } from "~/routes/api.unsplash";

function ImageBubbleElement(
  element: GroupElement<typeof TYPE_IMAGE_BUBBLE_ELEMENT>,
) {
  const [fileSource, setFileSource] = useState("Upload");
  const fetcher = useFetcher<UnsplashLoaderData>();

  useEffect(() => {
    fetcher.load(`/api/unsplash?query=dogs`);
  }, []);

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
                data={["Upload", "Link", "Unsplash"]}
              />

              {fileSource === "Link" && (
                <>
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
                </>
              )}
              {fileSource == "Unsplash" && (
                <>
                  <Input placeholder={"Search"}></Input>
                  <Grid w={"100%"} overflow="hidden">
                    {fetcher.data?.type === "success" ? (
                      fetcher.data.response.results.map((photo) => (
                        <Grid.Col
                          span={6}
                          key={photo.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            updateGroupElement<typeof element.type>({
                              ...element,
                              data: {
                                ...element.data,
                                url: photo.urls.regular,
                              },
                            });
                          }}
                        >
                          <img
                            width={"auto"}
                            style={{ objectFit: "cover" }}
                            alt={photo.alt_description || ""}
                            src={photo.urls.thumb}
                          />
                          <Anchor
                            target="_blank"
                            href={`https://unsplash.com/${photo.user.username}?utm_source=Webble&utm_medium=referral`}
                          >
                            {photo.user.name}
                          </Anchor>
                        </Grid.Col>
                      ))
                    ) : (
                      <p>Loading...</p>
                    )}
                  </Grid>
                </>
              )}
            </Stack>
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
