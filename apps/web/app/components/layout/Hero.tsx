import { Title, Text, Button, Container } from "@mantine/core";
import { Dots } from "./Dots";
import classes from "./Hero.module.css";

export function HeroSection() {
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

        <div className={classes.controls}>
          <Button
            className={classes.control}
            size="lg"
            variant="default"
            color="gray"
          >
            Show Me
          </Button>
          <Button className={classes.control} size="lg">
            Give it a try
          </Button>
        </div>
      </div>
    </Container>
  );
}
