import githubLogo from "@/img/githubLogo.png";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
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
  title: "plap",
  description: "Basic and intuitive planning poker web application",
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
        <header className="p-2">plap - Easy planning poker</header>

        <main>{children}</main>

        <footer className="flex space-x-2 p-4 items-center justify-center">
          <p>
            &copy;{new Date().getFullYear()}{" "}
            <Link
              href="https://soulsbros.ch"
              target="_blank"
              className="hover:text-blue-600"
            >
              Soulsbros
            </Link>
          </p>
          <Link
            href="https://github.com/Steeven9/plap"
            target="_blank"
            className="hover:rotate-45 transition-all"
          >
            <Image src={githubLogo} width={32} alt="GitHub logo" />
          </Link>
        </footer>
      </body>
    </html>
  );
}
