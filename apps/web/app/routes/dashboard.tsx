import { DashboardHeader } from "~/components/layout/DashboardHeader";
import { Container, SimpleGrid } from "@mantine/core";
import { useLoaderData } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { auth } from "~/services/auth.server";
import {
  createForm,
  deleteForm,
  listForms,
  updateForm,
} from "~/queries/form.queries";
import AgentCard from "~/components/cards/AgentCard";
import NewAgentCard from "~/components/cards/NewAgentCard";
import { createUserProfile, getCurrentUser } from "~/queries/user.queries";

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | Webble" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = auth.getSession(request);
  const isSignedIn = await session.isSignedIn();
  if (!isSignedIn) throw redirect("/login");

  // automatic user profile creation, for now we don't need any
  // additional details
  const currentUser = await getCurrentUser.run(session.client);
  if (!currentUser) await createUserProfile.run(session.client);

  const forms = await listForms.run(session.client);

  return { isSignedIn, forms };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const session = auth.getSession(request);
  const client = session.client;

  const action = formData.get("_action");

  if (action === "create") {
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    const form = await createForm.run(client, { name, color });

    return redirect("/build/" + form.id);
  }

  if (action === "update") {
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    const id = formData.get("id") as string;
    await updateForm.run(client, { id, name, color });

    return json({ success: true });
  }

  if (action === "delete") {
    const formId = formData.get("formId") as string;

    await deleteForm.run(client, { id: formId });

    return redirect(request.url);
  }
}

function Dashboard() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div>
      <DashboardHeader />
      <Container size="xl">
        <SimpleGrid
          cols={{ sm: 3, md: 4, lg: 4, xs: 2 }}
          px={{ sm: "lg", xs: "lg" }}
        >
          <NewAgentCard />

          {loaderData.forms.map((form) => (
            <AgentCard key={form.id} form={form} />
          ))}
        </SimpleGrid>
      </Container>
    </div>
  );
}

export default Dashboard;
