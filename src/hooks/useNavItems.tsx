import React from "react";

import { useEventStore } from "@/store/event-store";
import { CalendarCheck2, LandPlot, UserCog } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const useNavItems = () => {
  const { selectedEventId } = useEventStore();

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
    // {
    //   label: "Lead Retrieval",
    //   href: selectedEventId
    //     ? `/lead-retrieval?eventId=${selectedEventId}`
    //     : `/lead-retrieval`,
    //   icon: <Crown className="w-6 h-6" />,
    // },
    // {
    //   label: "Import Portal",
    //   href: selectedEventId
    //     ? `/import-portal?eventId=${selectedEventId}`
    //     : `/import-portal`,
    //   icon: <FileDown className="w-6 h-6" />,
    // },
    // {
    //   label: "Export Portal",
    //   href: selectedEventId
    //     ? `/export-portal?eventId=${selectedEventId}`
    //     : `/export-portal`,
    //   icon: <FileUp className="w-6 h-6" />,
    // },
    // {
    //   label: "Agenda Sync",
    //   href: selectedEventId
    //     ? `/agenda-sync?eventId=${selectedEventId}`
    //     : `/agenda-sync`,
    //   icon: <Rss className="w-6 h-6" />,
    // },
    // {
    //   label: "Group Allocation",
    //   href: selectedEventId
    //     ? `/group-allocation?eventId=${selectedEventId}`
    //     : `/group-allocation`,
    //   icon: <Users className="w-6 h-6" />,
    // },
    {
      label: "User Management",
      href: selectedEventId
        ? `/user-management?eventId=${selectedEventId}`
        : `/user-management`,
      icon: <UserCog className="w-6 h-6" />,
    },
  ];

  return defaultNavItems;
};

export default useNavItems;
