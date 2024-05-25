import cx from "clsx";
import { useState } from "react";
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
  useMantineTheme,
  Title,
  Progress,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconPlayerPause,
  IconTrash,
  IconSwitchHorizontal,
  IconChevronDown,
  IconLock,
  IconLogout2,
} from "@tabler/icons-react";
// import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./DashboardHeader.module.css";
import { Link } from "@remix-run/react";

const user = {
  name: "Jane Spoonfighter",
  email: "janspoon@fighter.dev",
  image:
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
};

const tabs = ["Home"];

export function DashboardHeader() {
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="xl">
        <Group justify="space-between" align={"center"}>
          <Title order={4}>Webble</Title>

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

          <Button
            color="red"
            component={Link}
            size={"xs"}
            variant={"light"}
            to={"/logout"}
            leftSection={
              <IconLogout2
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Logout
          </Button>
        </Group>
      </Container>
      <Container size="xl">
        <Tabs
          defaultValue="Home"
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
}
