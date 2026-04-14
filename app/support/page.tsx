import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Support — Sock" };

const FAQS = [
  {
    q: "How do I join a household?",
    a: 'Tap Household → "Join with code" and enter the 8-character code plus the household password. Someone already in the household can share the code with you.',
  },
  {
    q: "How do I create a room?",
    a: 'Go to the Household tab. If you\'re an admin (or the household allows members to manage rooms), tap "Create room", give it a name, and optionally set a password.',
  },
  {
    q: "Why can't I change my room status?",
    a: "You need to be a member of the room to set its status. Join the room first from the Household tab.",
  },
  {
    q: "What do the three statuses mean?",
    a: "Green (All Clear) — come in freely. Yellow (Knock First) — I might be busy, please knock. Red (Do Not Disturb) — don't interrupt, I'm unavailable.",
  },
  {
    q: "How do push notifications work?",
    a: "On the iOS app, enable notifications in Settings. The app registers your device with Firebase Cloud Messaging. You'll receive a push when any room status in your household changes.",
  },
  {
    q: "I forgot my password — how do I reset it?",
    a: "Password reset is coming soon. For now, if you can't sign in please contact us at the email below and we can help manually.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Settings → Delete account. This permanently removes your account, household memberships, and messages.",
  },
  {
    q: "The status didn't update — what happened?",
    a: "Status updates travel over a WebSocket connection. If you're on a flaky network, changes may be delayed. Pull to refresh on the home screen to force a reload.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border-default bg-bg-primary/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold text-xs">
            S
          </div>
          <span className="font-semibold">Sock</span>
        </Link>
        <Link href="/" className="text-sm text-text-muted hover:text-text-primary transition-colors">
          ← Home
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Support</h1>
        <p className="text-text-muted text-sm mb-10">
          Answers to common questions about Sock.
        </p>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Frequently asked questions</h2>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-bg-card border border-border-default rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium list-none select-none hover:bg-bg-elevated transition-colors">
                  {faq.q}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-text-muted flex-shrink-0 ml-3 transition-transform group-open:rotate-180"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-bg-card border border-border-default rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2">Still need help?</h2>
          <p className="text-text-muted text-sm leading-relaxed mb-4">
            If your question isn't answered above, reach out and we'll get back to you
            as soon as possible.
          </p>
          <div className="flex flex-col gap-2 text-sm text-text-secondary">
            <span>
              Email:{" "}
              <a
                href="mailto:support@getsock.app"
                className="text-brand-purple-light hover:underline"
              >
                support@getsock.app
              </a>
            </span>
          </div>
        </section>
      </div>

      <footer className="border-t border-border-default mt-8">
        <div className="max-w-2xl mx-auto px-6 py-6 flex gap-6 text-sm text-text-muted">
          <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
