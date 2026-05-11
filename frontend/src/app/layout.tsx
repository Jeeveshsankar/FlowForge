import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowForge - AI-Powered Visual Workflow Automation",
  description: "Drag, drop, and deploy AI-powered automations in minutes — no code required.",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-right" theme="dark" closeButton richColors />
      </body>
    </html>
  );
}
