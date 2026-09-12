import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant"; content: string };

const DEFAULT_SYSTEM =
  "You are Launchpad, the in-app assistant for STARTIFY — a platform for young entrepreneurs. " +
  "Answer questions about building startups, validating ideas, finding co-founders, pitching, and using the app " +
  "(pages: Dashboard, Discover, Validate, Co-Founders, Mentors, Progress, StartupTV, Create Startup, AI Tools). " +
  "Be concise, practical and encouraging. Use short paragraphs or bullets.";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: Msg[]; system?: string };
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) {
          return new Response("messages are required", { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const input = [
          { role: "system", content: [{ type: "input_text", text: body.system || DEFAULT_SYSTEM }] },
          ...messages.map((m) => ({
            role: m.role,
            content: [
              m.role === "assistant"
                ? { type: "output_text", text: m.content }
                : { type: "input_text", text: m.content },
            ],
          })),
        ];

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": apiKey,
            "X-Lovable-AIG-SDK": "fetch",
          },
          body: JSON.stringify({
            model: "openai/gpt-6-astra",
            input,
            stream: true,
            store: false,
            reasoning: { effort: "low" },
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          const status = upstream.status || 500;
          const message =
            status === 429
              ? "The assistant is busy right now. Please try again in a moment."
              : status === 402
                ? "AI credits have run out for this workspace."
                : `Assistant error (${status}). ${detail.slice(0, 200)}`;
          return new Response(message, { status });
        }

        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";

        const stream = new TransformStream<Uint8Array, Uint8Array>({
          transform(chunk, controller) {
            buffer += decoder.decode(chunk, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (!data || data === "[DONE]") continue;
              try {
                const evt = JSON.parse(data) as { type?: string; delta?: string };
                if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
                  controller.enqueue(encoder.encode(evt.delta));
                }
              } catch {
                /* ignore partial json */
              }
            }
          },
        });

        return new Response(upstream.body.pipeThrough(stream), {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
        });
      },
    },
  },
});