import { useToggle, upperFirst } from "@mantine/hooks";
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
  Checkbox,
  Anchor,
  Stack,
  Alert,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconInfoCircle,
} from "@tabler/icons-react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { UserAlreadyRegisteredError } from "@edgedb/auth-remix/server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: "Sign Up | Webble" }];
};

export function loader() {
  return json({
    oauth: process.env.OAUTH_ENABLED === "true",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  try {
    const { headers } = await auth.emailPasswordSignUp(request, {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    return redirect("/dashboard", { headers });
  } catch (err) {
    if (err instanceof UserAlreadyRegisteredError) {
      return json({
        error:
          "An account already exists with this email. Please try signing in.",
      });
    }

    console.log(err);

    return json({ error: "Something went wrong" });
  }
}

export default function LoginPage(props: PaperProps) {
  const { oauth } = useLoaderData<typeof loader>();
  const [type, toggle] = useToggle(["login", "register"]);
  const signupFetcher = useFetcher<{ error: string }>();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder {...props} w={"100%"} px={"xl"}>
      <Text size="lg" fw={500}>
        Welcome to Webble
      </Text>

      {oauth && (
        <Group grow mb="md" mt="md">
          <Button
            component={Link}
            to={"/oauth/google"}
            leftSection={<IconBrandGoogle />}
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
      )}

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form
        onSubmit={form.onSubmit(({ password, email }) => {
          signupFetcher.submit({ email, password }, { method: "POST" });
        })}
      >
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
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

          {type === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
            />
          )}

          {signupFetcher.data?.error && (
            <Alert color={"red"} variant={"outline"} icon={<IconInfoCircle />}>
              {signupFetcher.data.error}
            </Alert>
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component={Link} c="dimmed" size="xs" to={"/login"}>
            Already have an account? Login
          </Anchor>
          <Button type="submit" radius="xl">
            Register
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
