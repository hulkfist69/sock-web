"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppProvider, useApp } from "@/lib/app-context";
import { SocketProvider } from "@/lib/socket";
import SockLogo from "@/components/ui/SockLogo";

// ─── Bottom nav ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    href: "/home",
    label: "Home",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        className={`w-6 h-6 ${active ? "fill-brand-purple" : "fill-text-muted"}`}
      >
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Chat",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        className={`w-6 h-6 ${active ? "fill-brand-purple" : "fill-text-muted"}`}
      >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    ),
  },
  {
    href: "/household",
    label: "Household",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        className={`w-6 h-6 ${active ? "fill-brand-purple" : "fill-text-muted"}`}
      >
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        className={`w-6 h-6 ${active ? "fill-brand-purple" : "fill-text-muted"}`}
      >
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
    ),
  },
] as const;

function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border-default bg-bg-secondary pb-safe">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 py-2 px-4 min-w-0"
          >
            {item.icon(active)}
            <span
              className={`text-[10px] font-medium ${active ? "text-brand-purple" : "text-text-muted"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

// ─── App shell header ─────────────────────────────────────────────────────────

function AppHeader() {
  const { activeHousehold, activeRoom } = useApp();

  const statusColor =
    activeRoom?.status === "green"
      ? "bg-status-green"
      : activeRoom?.status === "yellow"
        ? "bg-status-yellow"
        : activeRoom?.status === "red"
          ? "bg-status-red"
          : "bg-bg-panel";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-bg-primary border-b border-border-default">
      {/* Household + room pill */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-2 bg-bg-elevated rounded-full px-3 py-1.5 max-w-xs">
          {activeRoom && (
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor}`} />
          )}
          <span className="text-sm font-semibold truncate text-text-primary">
            {activeRoom?.room_name ?? activeHousehold?.household_name ?? "Sock"}
          </span>
        </div>
      </div>

      <SockLogo size={28} />
    </header>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

function AppShell({ children }: { children: React.ReactNode }) {
  const { loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-pulse">
            <SockLogo size={44} />
          </div>
          <p className="text-text-muted text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary max-w-lg mx-auto">
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}

// ─── Layout export ────────────────────────────────────────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <SocketProvider>
        <AppShell>{children}</AppShell>
      </SocketProvider>
    </AppProvider>
  );
}
