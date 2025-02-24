import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/AuthContextProvider";
import type { Metadata } from "next";
import { CookiesProvider } from "next-client-cookies/server";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyCirse",
  description: "MyCirse Portals",
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
