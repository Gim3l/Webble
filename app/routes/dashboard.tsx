import { DashboardHeader } from "~/components/layout/DashboardHeader";
import {
  ActionIcon,
  Avatar,
  Card,
  Container,
  Flex,
  Menu,
  rem,
  SimpleGrid,
  Stack,
  Title,
} from "@mantine/core";
import { Link, useLoaderData } from "@remix-run/react";
import { IconDotsVertical, IconExternalLink } from "@tabler/icons-react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { listForms } from "~/queries/form.queries";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = auth.getSession(request);
  const isSignedIn = await session.isSignedIn();
  const forms = await listForms.run(session.client);

  return { isSignedIn, forms };
}

function Dashboard() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div>
      <DashboardHeader />
      <Container size="xl">
        <SimpleGrid cols={{ sm: 2, md: 4 }}>
          {loaderData.forms.map((form) => (
            <Card
              key={form.id}
              w={240}
              h={240}
              component={Link}
              to={`/build/${form.id}`}
              withBorder
              style={{
                cursor: "pointer",
              }}
            >
              <Stack>
                <Flex
                  justify={"end"}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Menu width={200} shadow="md">
                    <Menu.Target>
                      <ActionIcon variant={"light"}>
                        <IconDotsVertical size={18} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item component="a" href="https://mantine.dev">
                        Mantine website
                      </Menu.Item>
                      <Menu.Item
                        leftSection={
                          <IconExternalLink
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                        component="a"
                        href="https://mantine.dev"
                        target="_blank"
                      >
                        External link
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Flex>
                <Flex justify={"center"} align={"center"}>
                  <Avatar color="cyan" radius="md" size={"xl"}>
                    🦄
                  </Avatar>
                </Flex>
                <Flex justify={"center"}>
                  <Title order={3}>{form.name}</Title>
                </Flex>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </div>
  );
}

export default Dashboard;
