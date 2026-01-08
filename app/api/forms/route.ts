import googleFormsService from "@/services/googleFormsService";

export async function POST(req: Request) {
  const { userId } = await req.json();

  const googleForms = new googleFormsService();
  await googleForms.initialize(userId);
}
