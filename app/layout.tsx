import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sock — Shared Living, Simplified",
  description:
    "Real-time room status for your household. Green, yellow, or red — everyone knows when to knock.",
  icons: { icon: "/sock-icon.png", apple: "/sock-icon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
