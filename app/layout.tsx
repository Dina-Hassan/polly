import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polly - Create and Share Polls",
  description: "A modern polling application built with Next.js",
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
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">Polly</Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/polls" className="text-sm font-medium hover:text-indigo-600">Polls</Link>
              <Link href="/polls/create" className="text-sm font-medium hover:text-indigo-600">Create Poll</Link>
              <Link href="/login" className="text-sm font-medium hover:text-indigo-600">Login</Link>
              <Link href="/register" className="text-sm font-medium hover:text-indigo-600">Register</Link>
            </nav>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
