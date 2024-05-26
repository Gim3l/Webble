import {
  Title,
  Text,
  Button,
  Container,
  Box,
  Group,
  Collapse,
} from "@mantine/core";
import { Dots } from "./Dots";
import classes from "./Hero.module.css";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export function HeroSection({ formId }: { formId: string }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Build{" "}
          <Text component="span" className={classes.highlight} inherit>
            super powered
          </Text>{" "}
          conversational forms
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            Engage your audience effortlessly with dynamic, interactive forms
            that transform conversations into conversions. Our platform empowers
            you to create seamless, personalized experiences that captivate and
            convert.
          </Text>
        </Container>

        <Group className={classes.controls}>
          <Button
            className={classes.control}
            size="lg"
            variant="default"
            color="gray"
            onClick={() => toggle()}
          >
            Show Me
          </Button>

          <Box>
            <Button
              className={classes.control}
              size="lg"
              component={Link}
              to={"/signup"}
            >
              Give it a try
            </Button>
          </Box>
        </Group>
      </div>
      <Collapse in={opened} py={"xl"}>
        {opened && <webble-chatbox formId={formId} />}
      </Collapse>
    </Container>
  );
}
