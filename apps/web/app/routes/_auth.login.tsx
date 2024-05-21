import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
  Alert,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconInfoCircle,
} from "@tabler/icons-react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import { NoIdentityFoundError } from "@edgedb/auth-remix/server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  try {
    const { headers } = await auth.emailPasswordSignIn(request, {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    return redirect("/dashboard", { headers });
  } catch (err) {
    if (err instanceof NoIdentityFoundError) {
      throw redirect("?error=invalid_credentials");
    }

    throw redirect("?error=unknown_error");
  }
}

export default function LoginPage(props: PaperProps) {
  const [searchParams] = useSearchParams();
  const hasInvalidCredsError =
    searchParams.get("error") === "invalid_credentials";

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const fetcher = useFetcher();

  return (
    <Paper radius="md" p="xl" withBorder {...props} w={"100%"} px={"xl"}>
      <Text size="lg" fw={500}>
        Welcome to Webble, login with
      </Text>

      <Group grow mb="md" mt="md">
        <Button
          leftSection={<IconBrandGoogle />}
          component={Link}
          to={"/oauth/google"}
          variant="default"
        >
          Google
        </Button>
        <Button
          component={Link}
          to={"/oauth/github"}
          leftSection={<IconBrandGithub />}
          variant="default"
        >
          GitHub
        </Button>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form
        onSubmit={form.onSubmit(({ email, password }) => {
          fetcher.submit({ email, password }, { method: "POST" });
        })}
      >
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="hello@webble.co"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />
          {hasInvalidCredsError && (
            <Alert color={"red"} variant={"outline"} icon={<IconInfoCircle />}>
              Invalid credentials supplied
            </Alert>
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component={Link} to={"/signup"} c="dimmed" size="xs">
            Don&apos;t have an account? Register
          </Anchor>
          <Button loading={fetcher.state !== "idle"} type="submit" radius="xl">
            Login
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
