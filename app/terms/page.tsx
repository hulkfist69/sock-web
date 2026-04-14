import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service — Sock" };

export default function TermsPage() {
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

      <article className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-text-muted text-sm mb-10">Last updated: April 2025</p>

        <Section title="Acceptance">
          <p>
            By creating a Sock account or using the Sock web app you agree to these Terms.
            If you don't agree, please don't use Sock.
          </p>
        </Section>

        <Section title="Your account">
          <p>
            You're responsible for keeping your password confidential and for all activity
            that occurs under your account. Notify us immediately if you suspect unauthorised
            access.
          </p>
          <p>
            You must be at least 13 years old to create an account.
          </p>
        </Section>

        <Section title="Acceptable use">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Post illegal, harmful, or offensive content in household chats.</li>
            <li>Attempt to access accounts, data, or systems you're not authorised to use.</li>
            <li>Use Sock in a way that disrupts or degrades the service for others.</li>
            <li>Reverse-engineer or scrape Sock without permission.</li>
          </ul>
        </Section>

        <Section title="Content">
          <p>
            You retain ownership of content you post. By posting in Sock you grant us a
            limited licence to store and transmit that content to deliver the service.
            We don't claim ownership of your messages or photos.
          </p>
        </Section>

        <Section title="Service availability">
          <p>
            Sock is provided as-is. We're a small team and cannot guarantee 100% uptime.
            We may modify or discontinue features at any time. We'll try to give reasonable
            notice for significant changes.
          </p>
        </Section>

        <Section title="Termination">
          <p>
            You can delete your account at any time from Settings. We may suspend or
            terminate accounts that violate these Terms.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the maximum extent permitted by law, Sock is not liable for any indirect,
            incidental, or consequential damages arising from your use of the service.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these Terms from time to time. Continued use of Sock after
            changes means you accept the new Terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions?{" "}
            <Link href="/support" className="text-brand-purple-light hover:underline">
              Reach out via Support.
            </Link>
          </p>
        </Section>
      </article>

      <footer className="border-t border-border-default mt-8">
        <div className="max-w-2xl mx-auto px-6 py-6 flex gap-6 text-sm text-text-muted">
          <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
          <Link href="/support" className="hover:text-text-primary transition-colors">Support</Link>
        </div>
      </footer>
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
