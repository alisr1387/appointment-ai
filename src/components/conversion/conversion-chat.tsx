"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function getVisitorId() {
  if (typeof window === "undefined") return "";
  const key = "ace_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function ConversionChat({
  slug,
  businessName,
}: {
  slug: string;
  businessName: string;
}) {
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm the AI assistant for ${businessName}. What treatment or service are you interested in today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const visitorId = getVisitorId();

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    const apiMessages = [...messages, userMessage]
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          slug,
          sessionId,
          visitorId,
        }),
      });

      const sid = response.headers.get("X-Session-Id");
      if (sid) setSessionId(sid);

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantContent } : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Sorry, I'm having trouble connecting right now. Please try again.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[min(600px,70vh)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e14]/90 shadow-glow-lg backdrop-blur-md">
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
          <MessageSquare className="h-4 w-4 text-accent" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">AI Assistant</p>
          <p className="text-xs text-slate-500">Qualification & booking</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                message.role === "user"
                  ? "bg-accent text-white"
                  : "border border-white/10 bg-white/5 text-slate-200"
              }`}
            >
              <p className="whitespace-pre-wrap">
                {message.content || (isLoading ? "..." : "")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-white/5 p-4"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
