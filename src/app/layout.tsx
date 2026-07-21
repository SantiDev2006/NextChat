import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/auth";
import Login from "@/components/login";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextChat",
  description: "A real-time messaging app where you can add friends, create or join groups, and chat instantly. Fast, simple, and built for seamless communication.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
    >
      <body className={`${inter.className} flex h-screen bg-zinc-800 overflow-hidden text-zinc-100 antialiased`}>
        {session ? (
          <>
          <Sidebar />
          {children}
          </>
        ) : (
          <Login />
        )}
      </body>
    </html>
  );
}
