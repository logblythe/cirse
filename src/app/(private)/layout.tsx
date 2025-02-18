"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { useState } from "react";
import { isMobile } from "react-device-detect";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(isMobile);

  return (
    <div className="relative h-screen overflow-hidden md:flex">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setSidebarCollapsed}
        shown={showSidebar}
      />
      <ReactQueryProvider>
        <div className="flex-1 text-2xl  h-screen overflow-y-auto">
          <Navbar onMenuButtonClick={() => setShowSidebar((prev) => !prev)} />
          {children}
        </div>
      </ReactQueryProvider>
    </div>
  );
}
