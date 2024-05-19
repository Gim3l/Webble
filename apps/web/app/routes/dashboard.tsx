import { DashboardHeader } from "~/components/layout/DashboardHeader";
import { Container, SimpleGrid } from "@mantine/core";
import { useLoaderData } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { createForm, listForms } from "~/queries/form.queries";
import AgentCard from "~/components/cards/AgentCard";
import NewAgentCard from "~/components/cards/NewAgentCard";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = auth.getSession(request);
  const isSignedIn = await session.isSignedIn();

  if (!isSignedIn) throw redirect("/login");

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
    const form = await createForm.run(client, { name });

    return redirect("/build/" + form.id);
  }
}

function Dashboard() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div>
      <DashboardHeader />
      <Container size="xl">
        <SimpleGrid
          cols={{ sm: 3, md: 4, lg: 5, xs: 2 }}
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
