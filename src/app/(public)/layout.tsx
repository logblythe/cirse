import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
