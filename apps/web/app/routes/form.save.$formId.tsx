import { ActionFunctionArgs, json } from "@remix-run/node";
import { auth } from "~/services/auth.server";
import { updateFormStructure } from "~/queries/form.queries";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get("_action");
  const session = auth.getSession(request);
  const client = session.client;

  if (_action === "saveStructure") {
    try {
      const structure = JSON.parse(formData.get("structure") as string);

      if (!structure["nodes"]) {
        return json({ success: false, message: "No nodes provided" });
      }

      // await new Promise((resolve) => setTimeout(resolve, 3000));
      await updateFormStructure.run(client, {
        id: params.formId as string,
        structure,
      });
    } catch (err) {
      return json({ success: false, error: "Unable to save changes" });
    }

    return json({ success: true });
  }

  return json({});
}
