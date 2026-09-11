import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Spendora — Personal Finance & Expense Tracker",
  description: "Track expenses, manage budgets, and achieve financial goals with Spendora.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white"
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
