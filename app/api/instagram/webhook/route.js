export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = "premiere2026";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(request) {
  const body = await request.json();

  console.log("Instagram webhook received:", JSON.stringify(body, null, 2));

  if (body.object !== "instagram") {
    return Response.json({ received: false }, { status: 404 });
  }

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== "messages") continue;

      const value = change.value;
      const senderId = value?.sender?.id;
      const messageText = value?.message?.text;
      const messageId = value?.message?.mid;

      console.log("Instagram message event:", {
        senderId,
        messageId,
        messageText,
      });
    }
  }

  return Response.json({ received: true }, { status: 200 });
}
