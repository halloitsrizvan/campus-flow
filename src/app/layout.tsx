import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles.css";
import { Toaster } from "@/components/ui/sonner";
import DbProvider from "@/components/db-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VenueHub — College Venue Booking & Programme Management",
  description:
    "Book venues without conflicts, submit programme budgets, and track approvals end-to-end.",
  openGraph: {
    title: "VenueHub — College Venue Booking & Programme Management",
    description:
      "Book venues without conflicts, submit programme budgets, and track approvals end-to-end.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <DbProvider>{children}</DbProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
