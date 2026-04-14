import Link from "next/link";
import Image from "next/image";

// ─── Status colour helpers ────────────────────────────────────────────────────

const STATUS = {
  green: {
    label: "All Clear",
    desc: "Come on in — the door is open.",
    bg: "bg-status-green",
    dot: "bg-status-green",
  },
  yellow: {
    label: "Knock First",
    desc: "I might be busy — give a knock before entering.",
    bg: "bg-status-yellow",
    dot: "bg-status-yellow",
    textDark: true,
  },
  red: {
    label: "Do Not Disturb",
    desc: "Heads down, please come back later.",
    bg: "bg-status-red",
    dot: "bg-status-red",
  },
} as const;

const FEATURES = [
  {
    icon: "🚦",
    title: "Three-state status",
    body: "Green, yellow, red — a traffic light on every door. Set it in one tap; everyone sees it live.",
  },
  {
    icon: "💬",
    title: "Household chat",
    body: "One shared chat for your house. Status changes show up inline so nothing gets lost.",
  },
  {
    icon: "🔔",
    title: "Push notifications",
    body: "Get notified the moment a housemate's status changes, even when the app is closed.",
  },
  {
    icon: "🏠",
    title: "Multiple rooms",
    body: "Bedroom, studio, office — each room has its own status. Join only the rooms that matter to you.",
  },
  {
    icon: "👥",
    title: "Roles & permissions",
    body: "Admins manage the household. Members update their own rooms. Simple.",
  },
  {
    icon: "⚡",
    title: "Real-time, always",
    body: "Built on WebSockets. Status updates reach everyone in your house within milliseconds.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Create a household",
    body: "Give it a name and a password, then share the 8-character code with your housemates.",
  },
  {
    n: "2",
    title: "Join your rooms",
    body: "Rooms can be your bedroom, the studio, wherever. Join the ones that involve you.",
  },
  {
    n: "3",
    title: "Set your status",
    body: "One tap — green, yellow, or red. Your housemates see it instantly.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border-default bg-bg-primary/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="font-semibold text-lg tracking-tight">Sock</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-brand-purple hover:bg-brand-purple-dark text-white px-4 py-2 rounded-full transition-colors font-medium"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-brand-purple/40 bg-brand-purple/10">
          <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
          <span className="text-xs text-brand-purple-light font-medium">
            Now in TestFlight
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
          The traffic light
          <br />
          <span className="text-brand-purple">on your front door.</span>
        </h1>

        <p className="text-xl text-text-secondary max-w-xl leading-relaxed mb-10">
          Sock lets your household see at a glance whether each room is open,
          needs a knock, or is off-limits — all in real time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <a
            href="https://testflight.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
            </svg>
            Download on TestFlight
          </a>
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 border border-border-strong text-text-primary px-6 py-3 rounded-full hover:bg-bg-elevated transition-colors font-semibold"
          >
            Use on web
          </Link>
        </div>
      </section>

      {/* Status demo */}
      <section className="px-6 pb-24 max-w-2xl mx-auto w-full">
        <div className="rounded-2xl border border-border-default bg-bg-card overflow-hidden">
          {/* Mock header */}
          <div className="flex items-center px-4 py-3 border-b border-border-default bg-bg-secondary">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="mx-auto text-xs text-text-muted font-medium">
              Flat 4B
            </span>
          </div>
          {/* Status cards */}
          <div className="grid grid-cols-3 gap-3 p-4">
            {(["green", "yellow", "red"] as const).map((s) => (
              <div
                key={s}
                className={`${STATUS[s].bg} rounded-lg aspect-square flex flex-col items-center justify-center gap-1 p-3`}
              >
                <span
                  className={`text-sm font-semibold text-center leading-tight ${"textDark" in STATUS[s] && STATUS[s].textDark ? "text-black" : "text-white"}`}
                >
                  {STATUS[s].label}
                </span>
              </div>
            ))}
          </div>
          {/* Mock rooms */}
          <div className="px-4 pb-4 space-y-2">
            {[
              { name: "Alex's Room", status: "green" as const },
              { name: "Studio", status: "red" as const },
              { name: "Jordan's Room", status: "yellow" as const },
            ].map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-bg-elevated"
              >
                <span className="text-sm text-text-primary font-medium">
                  {r.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${STATUS[r.status].dot}`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      r.status === "yellow"
                        ? "text-status-yellow"
                        : r.status === "green"
                          ? "text-status-green"
                          : "text-status-red"
                    }`}
                  >
                    {STATUS[r.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What each status means */}
      <section className="px-6 pb-24 max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-3">
          Three states. One glance.
        </h2>
        <p className="text-center text-text-secondary mb-12">
          No ambiguity. Everyone in the house knows exactly what each status
          means.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {(["green", "yellow", "red"] as const).map((s) => (
            <div
              key={s}
              className="flex flex-col gap-3 p-5 rounded-2xl border border-border-default bg-bg-card"
            >
              <span
                className={`w-10 h-10 rounded-full ${STATUS[s].bg} flex items-center justify-center`}
              />
              <span className="font-semibold text-lg">{STATUS[s].label}</span>
              <span className="text-sm text-text-secondary leading-relaxed">
                {STATUS[s].desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 pb-24 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything your household needs
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-2xl border border-border-default bg-bg-card hover:border-brand-purple/40 transition-colors"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-24 max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold">
                {step.n}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="absolute ml-5 mt-10 w-px h-6 bg-border-default hidden" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 max-w-2xl mx-auto w-full text-center">
        <div className="rounded-2xl border border-brand-purple/30 bg-brand-purple/10 px-8 py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-text-secondary mb-8">
            Download the iOS app or sign up on the web — free during beta.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://testflight.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-current"
                aria-hidden="true"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
              </svg>
              TestFlight (iOS)
            </a>
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-default mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-purple flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <span className="text-sm text-text-muted">
              © {new Date().getFullYear()} Sock
            </span>
          </div>
          <div className="flex gap-6 text-sm text-text-muted">
            <Link href="/privacy" className="hover:text-text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-text-primary transition-colors">
              Terms
            </Link>
            <Link href="/support" className="hover:text-text-primary transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
