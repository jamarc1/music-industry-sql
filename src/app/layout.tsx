import type { Metadata } from "next";
import { Geist, Geist_Mono, Special_Elite } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const detectiveFont = Special_Elite({
  variable: "--font-detective",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The A&R Files",
  description: "A music-industry SQL mystery — learn SELECT, WHERE, ORDER BY, GROUP BY, and JOIN by working the label's data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${detectiveFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
