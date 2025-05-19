import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Nunito({
  variable: "--font-Nunito-sans",
  subsets: ["latin"],
});

const geistMono = Nunito({
  variable: "--font-Nunito-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Dashboard",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-h-screen`}
      ><AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
