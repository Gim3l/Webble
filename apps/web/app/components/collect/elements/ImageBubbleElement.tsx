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
} from "@mantine/core";
import ElementWrapper from "./ElementWrapper";
import { Grid as GiphyGrid } from "@giphy/react-components";

import { elementsConfig, ImageBubbleGroupElement } from "@webble/elements";
import { updateGroupElement } from "~/components/collect/store";
import { useCallback, useEffect, useState } from "react";
import { useFetcher, useParams } from "@remix-run/react";
import { UnsplashData } from "~/routes/api.unsplash";
import { useDebouncedValue } from "@mantine/hooks";
import "@mantine/dropzone/styles.css";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

function ImageBubbleElement(element: ImageBubbleGroupElement) {
  const [fileSource, setFileSource] = useState("Upload");
  const unsplashFetcher = useFetcher<UnsplashData>({ key: "unsplash" });
  const [giphySearch, setGiphySearch] = useState("");
  const [debouncedGiphySearch] = useDebouncedValue(giphySearch, 300);
  const [unsplashSearch, setUnsplashSearch] = useState("");
  const [debouncedUnsplashSearch] = useDebouncedValue(unsplashSearch, 300);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  useEffect(() => {
    unsplashFetcher.submit(
      {},
      {
        method: "POST",
        action: `/api/unsplash?query=${debouncedUnsplashSearch}`,
      },
    );
  }, [debouncedUnsplashSearch]);

  const fetchGifs = useCallback(
    (offset: number) => {
      const searchParams = new URLSearchParams();
      searchParams.set("query", debouncedGiphySearch);
      if (offset) searchParams.set("offset", offset.toString());
      return fetch(`/api/giphy?${searchParams.toString()}`).then((res) =>
        res.json(),
      );
    },
    [debouncedGiphySearch],
  );

  const uploadFetcher = useFetcher<
    | { success: true; url: string; key: string }
    | { success: false; url: null; message: string }
  >();
  const params = useParams();

  useEffect(() => {
    if (uploadFetcher.data?.success && uploadFetcher.data?.url) {
      updateGroupElement<ImageBubbleGroupElement>({
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
                data={["Link", "Upload", "Unsplash", "Giphy"]}
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
                    accept={IMAGE_MIME_TYPE}
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
                        <IconPhoto
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
                          Drag images here or click to select file
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
                    label="Image URL"
                    defaultValue={element.data.url}
                    placeholder="Enter URL"
                    variant="filled"
                    onChange={(e) => {
                      updateGroupElement<ImageBubbleGroupElement>({
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
                  <Input
                    placeholder={"Search"}
                    value={unsplashSearch}
                    onChange={(e) => setUnsplashSearch(e.target.value)}
                  ></Input>
                  <Grid
                    w={"100%"}
                    // overflow="hidden"
                    pos={"relative"}
                    gutter={"xs"}
                  >
                    <LoadingOverlay
                      visible={unsplashFetcher.state !== "idle"}
                      zIndex={1000}
                      overlayProps={{ radius: "sm", blur: 2 }}
                    />
                    {unsplashFetcher.data?.type === "success" ? (
                      unsplashFetcher.data.results.map((photo) => (
                        <Grid.Col
                          span={4}
                          key={photo.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedImageId(photo.id);
                            fetch(photo.links.download_location, {
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Client-ID ${unsplashFetcher.data?.accessKey}`,
                              },
                            })
                              .then(async (res) => {
                                const data = (await res.json()) as {
                                  url: string;
                                };
                                updateGroupElement<ImageBubbleGroupElement>({
                                  ...element,
                                  data: {
                                    ...element.data,
                                    url:
                                      data.url +
                                      "?utm_source=Webble&utm_medium=referral",
                                  },
                                });
                                setSelectedImageId(null);
                              })
                              .catch(() => {
                                setSelectedImageId(null);
                              });
                          }}
                        >
                          <Box>
                            <HoverCard width={300} shadow="md" openDelay={1000}>
                              <HoverCard.Target>
                                <AspectRatio
                                  ratio={16 / 9}
                                  maw={400}
                                  mx="auto"
                                  pos="relative"
                                >
                                  <Image
                                    radius="md"
                                    h={"100%"}
                                    w="100%"
                                    alt={photo.alt_description || ""}
                                    src={photo.urls.thumb}
                                  />
                                  <LoadingOverlay
                                    visible={selectedImageId === photo.id}
                                    color="#000"
                                  />
                                </AspectRatio>
                              </HoverCard.Target>
                              <HoverCard.Dropdown>
                                <Image
                                  radius="md"
                                  h={"auto"}
                                  w="100%"
                                  alt={photo.alt_description || ""}
                                  src={photo.urls.thumb}
                                />
                                <Center mt={"xs"}>
                                  <Group gap={"2px"}>
                                    <Anchor
                                      target="_blank"
                                      size={"xs"}
                                      href={`https://unsplash.com/${photo.user.username}?utm_source=Webble&utm_medium=referral`}
                                    >
                                      {photo.user.name}
                                    </Anchor>
                                    <Text size={"xs"}>on</Text>
                                    <Anchor
                                      target="_blank"
                                      size={"xs"}
                                      href={`https://unsplash.com`}
                                    >
                                      Unsplash
                                    </Anchor>
                                  </Group>
                                </Center>
                              </HoverCard.Dropdown>
                            </HoverCard>
                            <Anchor
                              target="_blank"
                              size={"xs"}
                              href={`https://unsplash.com/${photo.user.username}?utm_source=Webble&utm_medium=referral`}
                            >
                              {photo.user.name}
                            </Anchor>
                          </Box>
                        </Grid.Col>
                      ))
                    ) : (
                      <p>Loading...</p>
                    )}
                  </Grid>
                  {unsplashFetcher.data &&
                    unsplashFetcher.data.type === "success" && (
                      <Pagination
                        size={"sm"}
                        total={unsplashFetcher.data.total_pages}
                        onChange={(page) => {
                          const searchParams = new URLSearchParams();
                          searchParams.set("query", debouncedUnsplashSearch);
                          searchParams.set("page", page.toString());
                          unsplashFetcher.submit(
                            {},
                            {
                              method: "POST",
                              action: `/api/unsplash?${searchParams.toString()}`,
                            },
                          );
                        }}
                        value={unsplashFetcher.data.page}
                      />
                    )}
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
