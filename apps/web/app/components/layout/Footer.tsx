import { Anchor, Group, ThemeIcon, Title } from "@mantine/core";
import { IconMessageChatbotFilled } from "@tabler/icons-react";
import classes from "./Footer.module.css";

const links = [
  { link: "#", label: "Contact" },
  { link: "#", label: "Privacy" },
  { link: "#", label: "Blog" },
  { link: "#", label: "Store" },
  { link: "#", label: "Careers" },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      href={link.link}
      lh={1}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Group align={"center"} gap={8}>
          <ThemeIcon>
            <IconMessageChatbotFilled size={"xs"} />
          </ThemeIcon>
          <Title order={3}>Webble</Title>
        </Group>

        <Group className={classes.links}>
          This project was built for the EdgeDB 2024 hackathon
        </Group>

        {/*<Group gap="xs" justify="flex-end" wrap="nowrap">*/}
        {/*  <ActionIcon size="lg" variant="default" radius="xl">*/}
        {/*    <IconBrandInstagram*/}
        {/*      style={{ width: rem(18), height: rem(18) }}*/}
        {/*      stroke={1.5}*/}
        {/*    />*/}
        {/*  </ActionIcon>*/}
        {/*</Group>*/}
      </div>
    </div>
  );
}
