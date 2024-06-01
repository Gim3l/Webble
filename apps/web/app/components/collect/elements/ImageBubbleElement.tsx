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
import { useFetcher } from "@remix-run/react";
import { UnsplashLoaderData } from "~/routes/api.unsplash";
import { GiphyFetch } from "@giphy/js-fetch-api";

function ImageBubbleElement(
  element: GroupElement<typeof TYPE_IMAGE_BUBBLE_ELEMENT>,
) {
  const [fileSource, setFileSource] = useState("Upload");
  const fetcher = useFetcher<UnsplashLoaderData>();
  const [giphySearch, setGiphySearch] = useState("");

  useEffect(() => {
    fetcher.load(`/api/unsplash?query=dogs`);
  }, []);

  // const gf = new GiphyFetch("qsOMG8zWPf8Xc1BZK0CClOvwTTZ42viY");

  const fetchGifs = useCallback(
    (offset: number) => {
      const searchParams = new URLSearchParams();
      searchParams.set("query", giphySearch);
      if (offset) searchParams.set("offset", offset.toString());
      return fetch(`/api/giphy?${searchParams.toString()}`).then((res) =>
        res.json(),
      );
    },
    [giphySearch],
  );

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
                data={["Upload", "Link", "Unsplash", "Giphy"]}
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
              {fileSource == "Giphy" && (
                <Box>
                  <Group align={"end"} mb={"md"}>
                    <TextInput
                      label="Search"
                      placeholder="Search"
                      variant="filled"
                      onChange={(e) => setGiphySearch(e.target.value)}
                      value={giphySearch}
                      style={{ flexGrow: 1 }}
                    />
                    <img
                      src={"/powered_by_giphy.png"}
                      width={"100px"}
                      alt={""}
                    />
                  </Group>

                  <GiphyGrid
                    key={giphySearch}
                    width={400}
                    columns={3}
                    fetchGifs={fetchGifs}
                    onGifClick={(gif, e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      updateGroupElement<typeof element.type>({
                        ...element,
                        data: {
                          ...element.data,
                          url: gif.images.fixed_height.url,
                        },
                      });
                      console.log({ gif });
                    }}
                  />
                </Box>
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
