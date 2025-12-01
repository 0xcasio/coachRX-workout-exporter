import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoachRX Data Liberation",
  description: "Export your workout data from CoachRX screenshots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
