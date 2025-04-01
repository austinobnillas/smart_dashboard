import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Newsreader({
  variable: "--font-newsreader-sans",
  subsets: ["latin"],
});

const geistMono = Newsreader({
  variable: "--font-newsreader-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Pulse",
  description: "Smart dashbaord with real time information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
