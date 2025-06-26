import React from "react";

import { useEventStore } from "@/store/event-store";
import { CalendarCheck2, LandPlot, UserCog } from "lucide-react";
import { useUser } from "./useUser";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const useNavItems = () => {
  const { selectedEventId } = useEventStore();
  const { roles } = useUser();

  const defaultNavItems: NavItem[] = [
    {
      label: "Events",
      href: "/events",
      icon: <CalendarCheck2 className="w-6 h-6" />,
    },
    {
      label: "Portals",
      href: selectedEventId
        ? `/portals?eventId=${selectedEventId}`
        : `/portals`,
      icon: <LandPlot className="w-6 h-6" />,
    },
  ];
  if (roles.includes("SU_ADMIN")) {
    defaultNavItems.push({
      label: "User Management",
      href: selectedEventId
        ? `/user-management?eventId=${selectedEventId}`
        : `/user-management`,
      icon: <UserCog className="w-6 h-6" />,
    });
  }

  return defaultNavItems;
};

export default useNavItems;
