import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import { AuthProvider } from "@/providers/AuthContextProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conditionize",
  description: "Create and submit conditions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
        <CookiesProvider>
          <AuthProvider>{children}</AuthProvider>
        </CookiesProvider>
        <Toaster />
      </body>
    </html>
  );
}
