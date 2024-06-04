import { ActionFunctionArgs, json } from "@remix-run/node";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createImage } from "~/queries/image.queries";
import { auth } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = auth.getSession(request);
  const formData = await request.formData();
  const client = new S3Client({
    region: "us-east-1",
    endpoint:
      "https://69de5bdaf5a3f196e2f148984ff222e0.r2.cloudflarestorage.com",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_KEY || "",
    },
  });

  const file = formData.get("file") as File;
  const formId = formData.get("formId") as string;
  const elementId = formData.get("elementId") as string;

  const key = `public/form/${formId}/element/${elementId}`;
  try {
    await createImage.run(session.client, { formId, key });
  } catch (err) {
    return json(
      { success: false, message: "Unable to store image" },
      { status: 400 },
    );
  }

  console.log({ file: await file.arrayBuffer() });

  const putObjectCommand = new PutObjectCommand({
    Bucket: "webble-dev",
    Key: key,
    Body: (await file.arrayBuffer()) as unknown as Buffer,
    ContentType: file.type,
    ACL: "public-read",
  });

  await client.send(putObjectCommand).then((res) => res.$metadata);

  return json({
    success: true,
    key,
    url: `${process.env.CDN_ENDPOINT}/${key}?v=${new Date().getTime()}`,
  });
}
