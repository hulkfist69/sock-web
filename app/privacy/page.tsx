import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Sock" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Nav */}
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

      <article className="max-w-2xl mx-auto px-6 py-12 prose-invert">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-text-muted text-sm mb-10">Last updated: April 2025</p>

        <Section title="What we collect">
          <p>
            When you create a Sock account we collect: your username, password (stored as a
            bcrypt hash — we never store your plain-text password), and optionally a display
            name and profile photo.
          </p>
          <p>
            When you use the app we store messages you send in household chats, the room
            statuses you set, and your device's FCM push-notification token so we can
            deliver notifications to you.
          </p>
        </Section>

        <Section title="How we use it">
          <p>
            Your data is used solely to provide the Sock service — syncing statuses in
            real time, delivering messages to your household, and sending push notifications
            you've opted into. We do not sell, rent, or share your data with third parties
            for advertising.
          </p>
        </Section>

        <Section title="Third-party services">
          <ul className="list-disc pl-5 space-y-1 text-text-secondary text-sm">
            <li>
              <strong className="text-text-primary">Heroku</strong> — our server and
              PostgreSQL database are hosted on Heroku (Salesforce). Data is stored in
              US-based data centers.
            </li>
            <li>
              <strong className="text-text-primary">Firebase (Google)</strong> — we use
              Firebase Cloud Messaging to deliver push notifications. Your device token is
              stored in our database and passed to FCM when we need to notify you.
            </li>
          </ul>
        </Section>

        <Section title="Data retention">
          <p>
            Your account and associated data are retained until you delete your account.
            You can delete your account at any time from Settings → Delete account.
            Upon deletion all your personal data, household memberships, and messages
            are permanently removed.
          </p>
        </Section>

        <Section title="Security">
          <p>
            Passwords are hashed with bcrypt. All API traffic is served over HTTPS.
            JWT tokens expire and must be refreshed. We do not log plaintext credentials.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Sock is not directed at children under 13. If you believe a child has created
            an account, please contact us and we will remove it promptly.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Reach us via the{" "}
            <Link href="/support" className="text-brand-purple-light hover:underline">
              Support
            </Link>{" "}
            page.
          </p>
        </Section>
      </article>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="text-text-secondary text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border-default mt-8">
      <div className="max-w-2xl mx-auto px-6 py-6 flex gap-6 text-sm text-text-muted">
        <Link href="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
        <Link href="/support" className="hover:text-text-primary transition-colors">Support</Link>
      </div>
    </footer>
  );
}
