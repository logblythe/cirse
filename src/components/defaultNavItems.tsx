import React from "react";

import { Home, Crown, CalendarCheck2 } from "lucide-react";

// define a NavItem prop
export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const defaultNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <Home className="w-6 h-6" />,
  },
  {
    label: "Events",
    href: "/events",
    icon: <CalendarCheck2 className="w-6 h-6" />,
  },
  {
    label: "Rules",
    href: "/rules?eventId=157921",
    icon: <Crown className="w-6 h-6" />,
  },
];
