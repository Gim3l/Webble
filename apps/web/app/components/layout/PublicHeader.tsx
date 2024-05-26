import { useState } from "react";
import {
  Container,
  Group,
  Burger,
  Title,
  ThemeIcon,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./PublicHeader.module.css";
import {
  IconMessageChatbot,
  IconMessageChatbotFilled,
} from "@tabler/icons-react";
import { Link } from "@remix-run/react";

const links = [
  { link: "/about", label: "Features" },
  { link: "/pricing", label: "Pricing" },
  { link: "/learn", label: "Learn" },
  { link: "/community", label: "Community" },
];

export function PublicHeader() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group align={"center"} gap={8}>
          <ThemeIcon>
            <IconMessageChatbotFilled size={"xs"} />
          </ThemeIcon>
          <Title order={3}>Webble</Title>
        </Group>

        <Group gap={5} visibleFrom="xs">
          <Button component={Link} to={"/signup"}>
            Get Started
          </Button>
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
