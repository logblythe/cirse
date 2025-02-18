"use client";

import ApiClient from "@/api-client/";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventStore } from "@/store/event-store";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const questionsClient = new ApiClient();

const RULES_DETAILS_ROUTE_REGEX = /^\/rules\/[a-f0-9]{24}$/;

export function EventSelector() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["events"],
    queryFn: () => questionsClient.getEvents(),
  });

  const { selectEvent, selectedEventId } = useEventStore();

  return (
    <Select
      onValueChange={(eventId) => {
        const event = data?.find((event) => event.id === eventId);
        if (event) {
          selectEvent(event);
          const params = new URLSearchParams(searchParams);
          params.set("eventId", event.id); // Replace eventId
          router.push(`${pathname}?${params.toString()}`);
        }
      }}
      value={selectedEventId}
      disabled={RULES_DETAILS_ROUTE_REGEX.test(pathname)}
    >
      <SelectTrigger
        id="select-event-trigger"
        className="min-w-[180px] max-w-[460px]"
      >
        <SelectValue placeholder="Select an event" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Events</SelectLabel>
          {data?.map((event) => {
            return (
              <SelectItem key={event.id} value={event.id}>
                {event.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
