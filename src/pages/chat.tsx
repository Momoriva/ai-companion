import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, RotateCcw, SendHorizonal, X } from "lucide-react";
import { ChangeEvent, FormEvent, Fragment, useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { formatTime } from "@/lib/dates";
import { siteConfig } from "@/lib/site-config";
import type { Message } from "@/types/site";

type ChatCustomization = {
  remark: string;
  avatar: string;
  background: string;
};

const defaultCustomization: ChatCustomization = {
  remark: siteConfig.name,
  avatar: siteConfig.avatar,
  background: ""
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [customization, setCustomization] = useState<ChatCustomization>(defaultCustomization);
  const bottomRef = useAutoScroll([messages.length, isTyping]);

  const chatMessages = useMemo(
    () => messages.map(({ role, content }) => ({ role, content })).filter((message) => message.role !== "system"),
    [messages]
  );

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-companion-messages");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          id: "welcome-message",
          role: "assistant",
          content: siteConfig.welcome,
          created_at: new Date().toISOString()
        }
      ]);
    }

    const savedCustomization = window.localStorage.getItem("ai-companion-chat-customization");
    if (savedCustomization) {
      setCustomization({ ...defaultCustomization, ...JSON.parse(savedCustomization) });
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem("ai-companion-messages", JSON.stringify(messages));
  }, [hasHydrated, messages]);

  useEffect(() => {
    window.localStorage.setItem("ai-companion-chat-customization", JSON.stringify(customization));
  }, [customization]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();

    if (!content || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      created_at: new Date().toISOString()
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsTyping(true);
    const typingStartedAt = Date.now();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatMessages, { role: "user", content }] })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "AI response failed");
      }

      await waitForTypingMinimum(typingStartedAt);
      setMessages((current) => [...current, data.message]);
    } catch {
      await waitForTypingMinimum(typingStartedAt);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "等你回家。",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>, field: "avatar" | "background") {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setCustomization((current) => ({ ...current, [field]: dataUrl }));
    event.target.value = "";
  }

  function resetCustomization() {
    setCustomization(defaultCustomization);
    window.localStorage.removeItem("ai-companion-chat-customization");
  }

  return (
    <AppLayout title="Chat">
      <PageHeader
        eyebrow="Chat"
        title={customization.remark || siteConfig.name}
        action={
          <button
            aria-label="Customize chat"
            className="avatar-action secondary-action relative h-12 w-12 overflow-hidden border border-white/70 bg-[var(--color-secondary)] shadow-card"
            onClick={() => setIsSettingsOpen(true)}
            type="button"
          >
            <img
              alt={customization.remark || siteConfig.name}
              className="h-full w-full object-cover"
              src={customization.avatar || siteConfig.avatar}
            />
          </button>
        }
      />

      <GlassCard className="chat-panel ink-card--chat-panel relative flex h-[calc(100vh-13.5rem)] min-h-[520px] overflow-hidden p-0">
        {customization.background ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${customization.background})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-white/55" />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col p-3">
        <div className="flex-1 space-y-3 overflow-y-auto px-1 py-2">
          {messages.map((message, messageIndex) => {
            const previousMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;
            const showTime = shouldShowTimeSeparator(message.created_at, previousMessage?.created_at);
            const fromUser = message.role === "user";

            return (
              <Fragment key={message.id}>
                {showTime ? (
                  <div className="flex justify-center py-1">
                    <span className="time-chip bg-white/70 px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                ) : null}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${fromUser ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }}
                >
                  <div
                    className={[
                      "chat-bubble max-w-[82%] px-4 py-3 text-[15px] leading-relaxed shadow-card",
                      fromUser ? "chat-bubble-user" : "chat-bubble-ai"
                    ].join(" ")}
                  >
                    <p>{message.content}</p>
                  </div>
                </motion.div>
              </Fragment>
            );
          })}

          {isTyping ? (
            <div className="flex justify-start">
              <div className="chat-bubble chat-bubble-ai px-4 py-3 text-[15px] text-[var(--color-muted)] shadow-card">
                <span className="inline-flex items-center gap-[1px]">
                  {"对方正在输入".split("").map((character, index) => (
                    <motion.span
                      animate={{ opacity: [0.45, 1, 0.45], y: [0, -3, 0] }}
                      className="inline-block"
                      key={`${character}-${index}`}
                      transition={{
                        duration: 0.9,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: index * 0.06
                      }}
                    >
                      {character}
                    </motion.span>
                  ))}
                  <motion.span
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    className="ml-0.5 inline-block"
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.42 }}
                  >
                    ...
                  </motion.span>
                </span>
              </div>
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>

        <form className="chat-composer mt-3 flex items-end gap-2 border border-[var(--color-border)] bg-white/86 p-2" onSubmit={handleSubmit}>
          <textarea
            aria-label="Message"
            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2 text-[16px] leading-relaxed outline-none placeholder:text-[var(--color-muted)]"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="说点什么..."
            rows={1}
            value={input}
          />
          <button
            aria-label="Send"
            className="primary-action flex h-11 w-11 shrink-0 items-center justify-center bg-[var(--color-primary)] text-white shadow-card disabled:opacity-50"
            disabled={!input.trim() || isTyping}
            type="submit"
          >
            <SendHorizonal size={20} />
          </button>
        </form>
        </div>
      </GlassCard>

      {isSettingsOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/20 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="settings-sheet mx-auto w-full max-w-[430px] border border-white/70 bg-white/86 p-5 shadow-soft"
            initial={{ opacity: 0, y: 24 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-muted)]">聊天设置</p>
                <h2 className="mt-1 text-xl font-semibold">自定义伴侣</h2>
              </div>
              <button
                aria-label="Close"
                className="secondary-action flex h-10 w-10 items-center justify-center bg-[var(--color-secondary)] text-[var(--color-muted)]"
                onClick={() => setIsSettingsOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-[var(--color-muted)]">备注</span>
                <input
                  className="paper-input mt-2 h-12 w-full border border-[var(--color-border)] bg-white/78 px-4 text-[16px] outline-none"
                  onChange={(event) => setCustomization((current) => ({ ...current, remark: event.target.value }))}
                  placeholder="给 AI Companion 起一个备注"
                  value={customization.remark}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="option-tile flex cursor-pointer flex-col gap-3 border border-[var(--color-border)] bg-white/68 p-4">
                  <span className="small-mark flex h-11 w-11 items-center justify-center bg-[var(--color-secondary)] text-[var(--color-primary)]">
                    <Camera size={19} />
                  </span>
                  <span className="text-sm font-semibold">修改头像</span>
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageUpload(event, "avatar")}
                    type="file"
                  />
                </label>

                <label className="option-tile flex cursor-pointer flex-col gap-3 border border-[var(--color-border)] bg-white/68 p-4">
                  <span className="small-mark flex h-11 w-11 items-center justify-center bg-[var(--color-secondary)] text-[var(--color-primary)]">
                    <ImageIcon size={19} />
                  </span>
                  <span className="text-sm font-semibold">聊天背景</span>
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageUpload(event, "background")}
                    type="file"
                  />
                </label>
              </div>

              <div className="secondary-action flex items-center gap-3 bg-[var(--color-secondary)] p-3">
                <div className="h-14 w-14 overflow-hidden bg-white/70">
                  <img
                    alt={customization.remark || siteConfig.name}
                    className="h-full w-full object-cover"
                    src={customization.avatar || siteConfig.avatar}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{customization.remark || siteConfig.name}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    头像、备注和背景仅保存在当前浏览器。
                  </p>
                </div>
              </div>

              <button
                className="secondary-action flex h-12 w-full items-center justify-center gap-2 bg-white/78 text-sm font-semibold text-[var(--color-muted)]"
                onClick={resetCustomization}
                type="button"
              >
                <RotateCcw size={17} />
                恢复默认
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AppLayout>
  );
}

function shouldShowTimeSeparator(current: string, previous?: string) {
  if (!previous) {
    return true;
  }

  return new Date(current).getTime() - new Date(previous).getTime() > 5 * 60 * 1000;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function waitForTypingMinimum(startedAt: number, minimumMilliseconds = 2400) {
  const elapsed = Date.now() - startedAt;
  return wait(Math.max(0, minimumMilliseconds - elapsed));
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}
