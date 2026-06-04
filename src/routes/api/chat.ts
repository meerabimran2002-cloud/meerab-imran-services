import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM = `You are "Meera AI" — the friendly assistant for Meerab Imran's freelance studio website.

About Meerab:
- Full name: Meerab Imran. From Pakistan. College student.
- Skills: Web Developer & Programmer. Works with many happy clients and great reviews.
- Services: Web Development, Mobile Apps, UI/UX Design, Branding, Content Writing, Video Editing.
- Contact: meerab.imran.2002@gmail.com | LinkedIn: https://www.linkedin.com/in/meerab-imran-7aa400361/
- Site pages: Home (/), About (/about), Services (/services), Portfolio (/portfolio), Feedback (/feedback).

How to help:
- Answer questions about Meerab, her services, pricing ballparks, process, and how to hire her.
- If user wants to start a project, guide them to /feedback or share email/LinkedIn.
- Be warm, concise, and helpful. Reply in the same language the user writes in (English, Urdu, Roman Urdu, Arabic, German, French).
- Never invent personal details not listed above.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
