import type { MetaFunction } from "@remix-run/node";
import { HeroSection } from "~/components/layout/Hero";
import { UseCasesSection } from "~/components/layout/UseCases";
import { PublicHeader } from "~/components/layout/PublicHeader";
import {
  Box,
  Text,
  Card,
  Center,
  Highlight,
  Paper,
  SimpleGrid,
  Title,
  Stack,
} from "@mantine/core";
import { Footer } from "~/components/layout/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <PublicHeader />
      <HeroSection />
      <Center>
        <Card radius={"lg"} w={"60%"}>
          <img
            alt={"Interface of webble"}
            height={"auto"}
            src={"/images/interface.png"}
          ></img>
        </Card>
      </Center>

      <UseCasesSection />

      <Stack gap={"xl"}>
        <Center>
          <Paper
            withBorder
            bg={"dark.8"}
            p={12}
            px={18}
            radius={"lg"}
            w={{ sm: "65%", lg: "60%" }}
          >
            <Stack>
              <Highlight highlight={"simple"} component={Title} order={2}>
                It&apos;s simple to use
              </Highlight>
              <Text>
                Creating a form is simple on webble. You simple drag and drop.
                With this you can whip p a form in seconds to collect
                information or boost sales.
              </Text>
            </Stack>

            <Box mt={"lg"} style={{ borderRadius: 12, overflow: "hidden" }}>
              <img
                alt={"Interface of webble"}
                width={"auto"}
                height={"auto"}
                src={"/images/simple.png"}
              ></img>
            </Box>
          </Paper>
        </Center>

        <Center>
          <Paper
            withBorder
            bg={"dark.8"}
            p={12}
            px={18}
            radius={"lg"}
            w={{ sm: "65%", lg: "60%" }}
          >
            <Stack>
              <Highlight
                color="violet"
                highlight={"Useful"}
                component={Title}
                order={2}
              >
                Collect Useful Information
              </Highlight>
              <Text>
                View all your submissions at a glance right from the editor
              </Text>
            </Stack>

            <Box mt={"lg"} style={{ borderRadius: 12, overflow: "hidden" }}>
              <img
                alt={"Submissions"}
                width={"auto"}
                height={"auto"}
                src={"/images/submissions.png"}
              ></img>
            </Box>
          </Paper>
        </Center>
      </Stack>
      <Footer />
    </>
  );
}
