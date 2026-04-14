"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useApp } from "@/lib/app-context";
import { useSocket } from "@/lib/socket";
import { getHouseholdMessages, sendMessage } from "@/lib/api";
import type { Message } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  green: "All Clear",
  yellow: "Knock First",
  red: "Do Not Disturb",
};

const STATUS_COLORS: Record<string, string> = {
  green: "text-status-green",
  yellow: "text-status-yellow",
  red: "text-status-red",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Avatar({
  user,
}: {
  user: { display_name?: string | null; username: string; profile_image_url?: string | null };
}) {
  if (user.profile_image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.profile_image_url}
        alt={user.display_name ?? user.username}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
    );
  }
  const initials = (user.display_name ?? user.username).slice(0, 1).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center flex-shrink-0">
      <span className="text-white text-xs font-bold">{initials}</span>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  isOwn,
}: {
  msg: Message;
  isOwn: boolean;
}) {
  if (msg.message_type === "status_event") {
    // Parse status event: format is "{username} set {room_name} to {status}"
    const content = msg.content;
    return (
      <div className="flex justify-center py-1">
        <span className="text-xs text-text-muted bg-bg-elevated rounded-full px-3 py-1">
          {content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {!isOwn && (
        <Avatar
          user={{
            username: msg.username,
            display_name: msg.display_name,
            profile_image_url: msg.profile_image_url,
          }}
        />
      )}
      <div className={`flex flex-col gap-0.5 max-w-[72%] ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && (
          <span className="text-xs text-text-muted px-1">
            {msg.display_name ?? msg.username}
          </span>
        )}
        <div
          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? "bg-brand-purple text-white rounded-tr-sm"
              : "bg-bg-card text-text-primary rounded-tl-sm"
          }`}
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-text-muted px-1">
          {formatTime(msg.created_at)}
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { activeHousehold, user } = useApp();
  const { setHandlers, joinHousehold, emitTypingStart, emitTypingStop } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load messages
  useEffect(() => {
    if (!activeHousehold) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getHouseholdMessages(activeHousehold.id, 50, 0).then((res) => {
      const fetched = (res.data?.messages ?? []).slice().reverse();
      setMessages(fetched);
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView(), 50);
    });

    joinHousehold(activeHousehold.id);
    setHandlers({
      onNewMessage: (msg) => {
        setMessages((prev) => [...prev, msg]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      },
      onUserTypingStart: (payload) => {
        if (payload.userId !== user?.id) {
          setTypingUsers((prev) =>
            prev.includes(payload.username) ? prev : [...prev, payload.username]
          );
        }
      },
      onUserTypingStop: (payload) => {
        setTypingUsers((prev) => prev.filter((u) => u !== payload.username));
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHousehold?.id]);

  const handleInputChange = useCallback(
    (val: string) => {
      setInput(val);
      if (!activeHousehold) return;
      emitTypingStart(activeHousehold.id);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        emitTypingStop(activeHousehold.id);
      }, 2000);
    },
    [activeHousehold, emitTypingStart, emitTypingStop]
  );

  const handleSend = useCallback(async () => {
    if (!activeHousehold || !input.trim() || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);

    if (typingTimer.current) clearTimeout(typingTimer.current);
    emitTypingStop(activeHousehold.id);

    await sendMessage(activeHousehold.id, content);
    // Message will arrive via socket
    setSending(false);
  }, [activeHousehold, input, sending, emitTypingStop]);

  if (!activeHousehold) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
        <div className="text-4xl mb-4">💬</div>
        <p className="text-text-muted text-sm">Join a household to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {loading ? (
          <div className="flex justify-center pt-8">
            <span className="text-text-muted text-sm">Loading messages…</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center pt-8">
            <span className="text-text-muted text-sm">No messages yet. Say hello!</span>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} isOwn={msg.user_id === user?.id} />
          ))
        )}

        {typingUsers.length > 0 && (
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 bg-bg-card px-3 py-2 rounded-2xl rounded-tl-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-xs text-text-muted">
              {typingUsers.join(", ")} typing…
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-border-default bg-bg-secondary">
        <input
          type="text"
          placeholder="Message your household…"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-bg-elevated border border-border-default rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-9 h-9 rounded-full bg-brand-purple disabled:opacity-40 flex items-center justify-center transition-opacity flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
