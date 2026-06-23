import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Conversion Engine — Turn Visitors Into Qualified Customers",
  description:
    "AI-powered customer qualification, lead scoring, and automated booking for premium skin & beauty clinics.",
  openGraph: {
    title: "AI Conversion Engine",
    description:
      "Turn your visitors into qualified customers automatically with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
