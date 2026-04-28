import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
    for (const event of entry.messaging || []) {
      const attachments = event.message?.attachments || [];

      for (const attachment of attachments) {
        if (attachment.type !== "story_mention") continue;

        const storyUrl = attachment.payload?.url;
        const senderId = event.sender?.id;
        const messageId = event.message?.mid;

       // bepaal type (image of video)
let mediaType = "image";

if (storyUrl.includes(".mp4") || storyUrl.includes("video")) {
  mediaType = "video";
}

const { error } = await supabase.from("stories").insert([
  {
    user_name: "",
    caption: "",
    image_url: storyUrl,
    media_type: mediaType,
    status: "new",
  },
]);

        if (error) {
          console.error("Supabase insert error:", error.message);
        } else {
          console.log("Story mention saved:", {
            senderId,
            messageId,
            storyUrl,
          });
        }
      }
    }
  }

  return Response.json({ received: true }, { status: 200 });
}
