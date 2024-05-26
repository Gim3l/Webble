import {
  Image,
  Text,
  Container,
  ThemeIcon,
  Title,
  SimpleGrid,
} from "@mantine/core";
import classes from "./UseCases.module.css";
import { IconMessageChatbot } from "@tabler/icons-react";

const data = [
  {
    image: "auditors",
    title: "Lead Generation",
    description:
      "Capture leads effectively by using conversational forms that engage potential customers in a natural, interactive dialogue, collecting key information seamlessly.\n",
  },
  {
    image: "lawyers",
    title: "Customer Support",
    description:
      "Enhance your customer service experience with conversational forms that guide users through troubleshooting steps, FAQs, and support ticket creation.\n",
  },
  {
    image: "accountants",
    title: "Onboarding",
    description:
      "Improve new employee or customer onboarding with interactive forms that guide them through the necessary steps, ensuring all information is collected efficiently.\n",
  },
  {
    image: "others",
    title: "Ecommerce",
    description:
      "Boost sales by using conversational forms for product recommendations, order processing, and personalized shopping experiences.",
  },
];

export function UseCasesSection() {
  const items = data.map((item) => (
    <div className={classes.item} key={item.image}>
      <ThemeIcon
        variant="light"
        className={classes.itemIcon}
        size={60}
        radius="md"
      >
        <IconMessageChatbot />
        {/*<Image src={IMAGES[item.image]} />*/}
      </ThemeIcon>

      <div>
        <Text fw={700} fz="lg" className={classes.itemTitle}>
          {item.title}
        </Text>
        <Text c="dimmed">{item.description}</Text>
      </div>
    </div>
  ));

  return (
    <Container size={700} className={classes.wrapper}>
      <Text className={classes.supTitle}>Use cases</Text>

      <Title className={classes.title} order={2}>
        Conversational forms{" "}
        <span className={classes.highlight}>can be wherever</span> you want
      </Title>

      <Container size={660} p={0}>
        <Text c="dimmed" className={classes.description}>
          Forms are everywhere, but they are static. They are not engaging.
          Conversational forms can be anywhere your users are.
        </Text>
      </Container>

      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={50} mt={30}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
